package main

import (
	"fmt"
	"os"
	"skycastle/skycastle"

	"github.com/spf13/cobra"
)

var ErrWorkflowNotFound = fmt.Errorf("workflow not found")

func main() {
	rootCmd := &cobra.Command{
		Use:   "skycastle",
		Short: "Skycastle CLI",
	}

	describeCmd := &cobra.Command{
		Use:   "describe <target>",
		Short: "Describe a workflow",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			target, err := skycastle.ParseTarget(args[0])
			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}

			executionOptions, err := skycastle.NewExecutionOptions()
			if err != nil {
				return err
			}

			workflow, err := skycastle.Execute(cmd.Context(), executionOptions, target)
			if err != nil {
				return err
			}

			workflow.PrettyPrint(os.Stdout)
			return nil
		},
	}

	rootCmd.AddCommand(describeCmd)

	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}
