package main

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials/ec2rolecreds"
	"github.com/aws/aws-sdk-go-v2/feature/ec2/imds"
	"golang.org/x/sys/unix"
)

func getImdsCredentials(ctx context.Context, cfg aws.Config) (aws.Credentials, error) {
	imdsClient := imds.NewFromConfig(cfg)

	imdsCredsProvider := ec2rolecreds.New(
		func(opts *ec2rolecreds.Options) {
			opts.Client = imdsClient
		})

	credsCache := aws.NewCredentialsCache(imdsCredsProvider)

	creds, err := credsCache.Retrieve(ctx)
	if err != nil {
		return aws.Credentials{}, fmt.Errorf("failed to retrieve credentials from IMDS: %w", err)
	}

	return creds, nil
}

func getSigV4Headers(
	ctx context.Context,
	cfg aws.Config,
	creds aws.Credentials,
	service string,
	method string,
	url url.URL,
	body []byte,
	headers http.Header,
) (http.Header, error) {
	req, err := http.NewRequestWithContext(ctx, method, url.String(), bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create HTTP request: %w", err)
	}

	req.URL.Opaque = "//" + url.Host + url.EscapedPath()

	for k, vs := range headers {
		for _, v := range vs {
			req.Header.Add(k, v)
		}
	}

	sum := sha256.Sum256(body)
	payloadHash := hex.EncodeToString(sum[:])
	req.Header.Set("X-Amz-Content-Sha256", payloadHash)

	signer := v4.NewSigner()
	if err := signer.SignHTTP(ctx, creds, req, payloadHash, service, cfg.Region, time.Now()); err != nil {
		return nil, fmt.Errorf("failed to sign HTTP request: %w", err)
	}

	return req.Header, nil
}

func authenticate(
	ctx context.Context,
	sts_url url.URL,
	iam_request_body []byte,
	iam_request_headers http.Header,
) (*string, error) {
	header_map := make(map[string]any, len(iam_request_headers))
	for k, vs := range iam_request_headers {
		switch len(vs) {
		case 0:
			continue
		case 1:
			header_map[k] = vs[0]
		default:
			header_map[k] = vs
		}
	}

	header_json, err := json.Marshal(header_map)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal headers to JSON: %w", err)
	}

	payload := map[string]string{
		"role":                    "identity-app",
		"iam_http_request_method": http.MethodPost,
		"iam_request_url":         base64.StdEncoding.EncodeToString([]byte(sts_url.String())),
		"iam_request_body":        base64.StdEncoding.EncodeToString(iam_request_body),
		"iam_request_headers":     base64.StdEncoding.EncodeToString(header_json),
	}

	auth_url := url.URL{
		Scheme: "https",
		Host:   "openbao.internal.boxops.co.uk:8200",
		Path:   "v1/auth/aws/login",
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal auth payload to JSON: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, auth_url.String(), bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create auth HTTP request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to perform auth HTTP request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("authentication failed with status code: %d", resp.StatusCode)
	}

	var respData struct {
		Auth struct {
			ClientToken string `json:"client_token"`
		} `json:"auth"`
	}

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read auth response body: %w", err)
	}

	if err := json.Unmarshal(respBody, &respData); err != nil {
		return nil, fmt.Errorf("failed to unmarshal auth response JSON: %w", err)
	}

	return &respData.Auth.ClientToken, nil
}

func main() {
	ctx := context.Background()

	cfg, err := config.LoadDefaultConfig(ctx, config.WithEC2IMDSRegion())

	if err != nil {
		log.Fatalf("failed to load AWS SDK config, %v", err)
	}

	creds, err := getImdsCredentials(ctx, cfg)

	if err != nil {
		log.Fatalf("failed to get IMDS credentials: %v", err)
	}

	sts_host := "sts." + cfg.Region + ".amazonaws.com"
	sts_url := url.URL{
		Scheme: "https",
		Host:   sts_host,
	}
	body := []byte("Action=GetCallerIdentity&Version=2011-06-15")

	sigV4Headers, err := getSigV4Headers(
		ctx,
		cfg,
		creds,
		"sts",
		http.MethodPost,
		sts_url,
		body,
		http.Header{
			"Host":                      []string{sts_host},
			"Content-Type":              []string{"application/x-www-form-urlencoded; charset=utf-8"},
			"X-Vault-AWS-IAM-Server-ID": []string{"openbao.internal.boxops.co.uk"},
		},
	)

	if err != nil {
		log.Fatalf("failed to get SigV4 headers: %v", err)
	}

	token, err := authenticate(
		ctx,
		sts_url,
		body,
		sigV4Headers,
	)

	if err != nil {
		log.Fatalf("failed to authenticate: %v", err)
	}

	file, err := os.OpenFile("/run/openbao/token", os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0640)
	if err != nil {
		log.Fatalf("failed to open token file: %v", err)
	}

	defer file.Close()

	if _, err := file.WriteString(*token); err != nil {
		log.Fatalf("failed to write token to file: %v", err)
	}

	if err := unix.Fchown(int(file.Fd()), -1, 999); err != nil {
		log.Fatalf("failed to change token file group ownership: %v", err)
	}
}
