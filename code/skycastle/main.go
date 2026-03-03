package main

import (
	"fmt"
	"log/slog"
	"os"
	"skycastle/skycastle"

	"github.com/charmbracelet/log"
	"github.com/spf13/cobra"
)

var ErrWorkflowNotFound = fmt.Errorf("workflow not found")

func main() {
	skycastle.InitLogger(log.DebugLevel)

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
				slog.Error(err.Error())
				os.Exit(1)
			}

			executionOptions, err := skycastle.NewExecutionOptions(
				skycastle.WithConcurrencyLimit(1),
			)
			if err != nil {
				slog.Error(err.Error())
				os.Exit(1)
			}

			workflow, err := skycastle.Execute(cmd.Context(), executionOptions, target)
			if err != nil {
				slog.Error(err.Error())
				os.Exit(1)
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
