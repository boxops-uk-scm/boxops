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
			execCtx, err := skycastle.NewExecContext(skycastle.WithRepoRootPathFromFilesystem())
			if err != nil {
				return err
			}

			target, err := skycastle.ParseTarget(args[0])
			if err != nil {
				return err
			}

			module, err := skycastle.LoadModule(cmd.Context(), execCtx, target.Path)
			if err != nil {
				return err
			}

			workflow, ok := module.Workflows[target]
			if !ok {
				return ErrWorkflowNotFound
			}

			workflow.PrettyPrint(os.Stdout)

			_ = module
			return nil
		},
	}

	rootCmd.AddCommand(describeCmd)

	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}
