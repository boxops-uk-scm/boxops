package skycastle

import (
	"log/slog"
	"os"

	"github.com/charmbracelet/log"
)

func InitLogger(level log.Level) {
	handler := log.NewWithOptions(os.Stderr, log.Options{
		Level:           level,
		ReportTimestamp: true,
	})
	slog.SetDefault(slog.New(handler))
}
