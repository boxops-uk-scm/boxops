def go_build(name, pkg, description = None, ldflags = "", max_retries = 1, max_duration_seconds = 300):
    return action(
        description = description or ("Build " + name),
        command = 'set -euo pipefail; mkdir -p $(dirname $OUT); go build -trimpath -ldflags "' + ldflags + '" -o $OUT ' + pkg,
        policy = policy(
            max_retries = max_retries,
            max_duration_seconds = max_duration_seconds,
        ),
        outputs = {
            "OUT": file(
                description = "Compiled binary: " + name,
            ),
        },
    )

def go_test(pkg, description = "Run unit tests", max_retries = 0, max_duration_seconds = 600):
    return action(
        description = description,
        command = "set -euo pipefail; go test -count=1 -v " + pkg,
        policy = policy(
            max_retries = max_retries,
            max_duration_seconds = max_duration_seconds,
        ),
    )
