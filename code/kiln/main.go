package main

import (
	"fmt"

	"github.com/goccy/go-yaml"
)

type TypeMeta struct {
	Kind       string `yaml:"kind,omitempty"`
	APIVersion string `yaml:"apiVersion,omitempty"`
}

type Node struct {
	Role   string            `yaml:"role,omitempty"`
	Labels map[string]string `yaml:"labels,omitempty"`
}

type Cluster struct {
	TypeMeta `yaml:",inline"`
	Name     string `yaml:"name,omitempty"`
	Nodes    []Node `yaml:"nodes,omitempty"`
}

func main() {
	cluster := Cluster{
		TypeMeta: TypeMeta{
			APIVersion: "kind.x-k8s.io/v1alpha4",
			Kind:       "Cluster",
		},
		Name: "configerator-cluster",
		Nodes: []Node{
			{Role: "control-plane"},
			{Role: "worker", Labels: map[string]string{
				"configerator.boxops.co.uk/region": "us-west-1",
				"configerator.boxops.co.uk/zone":   "us-west-1b",
				"configerator.boxops.co.uk/pg":     "pg-d4906598",
			}},
			{Role: "worker", Labels: map[string]string{
				"configerator.boxops.co.uk/region": "us-west-1",
				"configerator.boxops.co.uk/zone":   "us-west-1c",
				"configerator.boxops.co.uk/pg":     "pg-49a5c314",
			}},
		},
	}

	data, err := yaml.Marshal(&cluster)
	if err != nil {
		panic(err)
	}
	fmt.Print(string(data))
}
