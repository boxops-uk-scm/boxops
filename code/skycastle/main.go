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

var logLevel string

func main() {
	rootCmd := &cobra.Command{
		Use:   "skycastle",
		Short: "Skycastle CLI",
		PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
			level, err := log.ParseLevel(logLevel)
			if err != nil {
				return fmt.Errorf("invalid log level: %w", err)
			}
			skycastle.InitLogger(level)
			return nil
		},
	}

	rootCmd.PersistentFlags().StringVar(
		&logLevel,
		"log-level",
		"info",
		"Set the logging level (debug, info, warn, error)",
	)

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
