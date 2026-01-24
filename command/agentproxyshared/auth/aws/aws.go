package aws

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials/ec2rolecreds"
	"github.com/aws/aws-sdk-go-v2/feature/ec2/imds"
	"github.com/aws/aws-sdk-go-v2/service/sts"
	"github.com/hashicorp/go-hclog"
	"github.com/openbao/openbao/api/v2"
	"github.com/openbao/openbao/command/agentproxyshared/auth"
)

type awsMethod struct {
	logger            hclog.Logger
	mountPath         string
	region            string
	useGlobalEndpoint bool
	serverId          string
	role              string
}

func NewAWSAuthMethod(conf *auth.AuthConfig) (auth.AuthMethod, error) {
	if conf == nil {
		return nil, errors.New("empty config")
	}

	a := &awsMethod{
		logger:    conf.Logger,
		mountPath: conf.MountPath,
	}

	if conf.Config != nil {
		regionRaw, ok := conf.Config["region"]
		if ok {
			region, ok := regionRaw.(string)
			if !ok {
				return nil, errors.New("could not convert 'region' config value to string")
			}
			a.region = region
		}

		useGlobalEndpointRaw, ok := conf.Config["use_global_endpoint"]
		if ok {
			useGlobalEndpoint, ok := useGlobalEndpointRaw.(bool)
			if !ok {
				return nil, errors.New("could not convert 'use_global_endpoint' config value to bool")
			}
			a.useGlobalEndpoint = useGlobalEndpoint
		}

		serverIdRaw, ok := conf.Config["server_id"]
		if ok {
			serverId, ok := serverIdRaw.(string)
			if !ok {
				return nil, errors.New("could not convert 'server_id' config value to string")
			}
			a.serverId = serverId
		}

		roleRaw, ok := conf.Config["role"]
		if ok {
			role, ok := roleRaw.(string)
			if !ok {
				return nil, errors.New("could not convert 'role' config value to string")
			}
			a.role = role
		}
	}

	return a, nil
}

func (j *awsMethod) Authenticate(ctx context.Context, client *api.Client) (string, http.Header, map[string]interface{}, error) {
	cfg, err := loadConfig(ctx, j.region)
	if err != nil {
		return "", nil, nil, fmt.Errorf("failed to load AWS config: %w", err)
	}

	creds, err := retrieveImdsCredentials(ctx, cfg)
	if err != nil {
		return "", nil, nil, fmt.Errorf("failed to retrieve credentials from IMDS: %w", err)
	}

	sts_endpoint, err := resolveStsEndpoint(ctx, cfg.Region, j.useGlobalEndpoint)
	if err != nil {
		return "", nil, nil, fmt.Errorf("failed to resolve STS endpoint: %w", err)
	}

	sts_req_values := url.Values{}
	sts_req_values.Set("Action", "GetCallerIdentity")
	sts_req_values.Set("Version", "2011-06-15")

	sts_req_body := []byte(sts_req_values.Encode())

	sts_req, err := http.NewRequestWithContext(ctx, http.MethodPost, sts_endpoint.String(), bytes.NewReader(sts_req_body))
	if err != nil {
		return "", nil, nil, fmt.Errorf("failed to create STS HTTP request: %w", err)
	}

	sts_req_checksum := sha256.Sum256(sts_req_body)
	sts_req_hash := hex.EncodeToString(sts_req_checksum[:])

	sts_req.Header.Set("Host", sts_endpoint.Host)
	sts_req.Header.Set("Content-Type", "application/x-www-form-urlencoded; charset=utf-8")
	sts_req.Header.Set("X-Vault-AWS-IAM-Server-ID", j.serverId)
	sts_req.Header.Set("X-Amz-Content-Sha256", sts_req_hash)

	signer := v4.NewSigner()
	if err := signer.SignHTTP(ctx, creds, sts_req, sts_req_hash, "sts", cfg.Region, time.Now()); err != nil {
		return "", nil, nil, fmt.Errorf("failed to sign STS request: %w", err)
	}

	sts_header_map := make(map[string]any, len(sts_req.Header))
	for k, vs := range sts_req.Header {
		switch len(vs) {
		case 0:
			continue
		case 1:
			sts_header_map[k] = vs[0]
		default:
			sts_header_map[k] = vs
		}
	}

	sts_header_json, err := json.Marshal(sts_header_map)
	if err != nil {
		return "", nil, nil, fmt.Errorf("failed to marshal STS headers to JSON: %w", err)
	}

	auth_req_mount_path := fmt.Sprintf("%s/login", j.mountPath)

	auth_req_payload := map[string]any{
		"role":                    j.role,
		"iam_http_request_method": http.MethodPost,
		"iam_request_url":         base64.StdEncoding.EncodeToString([]byte(sts_endpoint.String())),
		"iam_request_body":        base64.StdEncoding.EncodeToString(sts_req_body),
		"iam_request_headers":     base64.StdEncoding.EncodeToString(sts_header_json),
	}

	auth_req_header := http.Header{
		"Content-Type": []string{"application/json"},
	}

	return auth_req_mount_path, auth_req_header, auth_req_payload, nil
}

func loadConfig(ctx context.Context, region string) (aws.Config, error) {
	var opts awsConfig.LoadOptionsFunc
	if region != "" {
		opts = awsConfig.WithRegion(region)
	} else {
		opts = awsConfig.WithEC2IMDSRegion()
	}

	return awsConfig.LoadDefaultConfig(ctx, opts)
}

func retrieveImdsCredentials(ctx context.Context, cfg aws.Config) (aws.Credentials, error) {
	imdsClient := imds.NewFromConfig(cfg)

	imdsCredsProvider := ec2rolecreds.New(
		func(opts *ec2rolecreds.Options) {
			opts.Client = imdsClient
		})

	credsCache := aws.NewCredentialsCache(imdsCredsProvider)

	creds, err := credsCache.Retrieve(ctx)
	if err != nil {
		return aws.Credentials{}, err
	}

	return creds, nil
}

func resolveStsEndpoint(ctx context.Context, region string, useGlobalEndpoint bool) (url.URL, error) {
	resolver := sts.NewDefaultEndpointResolverV2()

	params := (sts.EndpointParameters{
		Region:            aws.String(region),
		UseGlobalEndpoint: aws.Bool(useGlobalEndpoint),
	}).WithDefaults()

	ep, err := resolver.ResolveEndpoint(ctx, params)
	if err != nil {
		return url.URL{}, err
	}

	return ep.URI, nil
}

func (j *awsMethod) NewCreds() chan struct{} {
	return nil
}

func (j *awsMethod) CredSuccess() {
}

func (j *awsMethod) Shutdown() {
}
