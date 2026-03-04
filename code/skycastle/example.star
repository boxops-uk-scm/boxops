load("code/skycastle/go.star", "go_build", "go_test")

def tar_gz(name, input_file, description = None, max_retries = 1, max_duration_seconds = 120):
    return action(
        description = description or ("Package " + name),
        command = "set -euo pipefail; mkdir -p $(dirname $OUT); tar -C $(dirname $INPUT) -czf $OUT $(basename $INPUT)",
        policy = policy(
            max_retries = max_retries,
            max_duration_seconds = max_duration_seconds,
        ),
        inputs = {
            "INPUT": input_file,
        },
        outputs = {
            "OUT": file(
                description = "Tarball package: " + name,
            ),
        },
    )

smoke_test_command = """set -euo pipefail; 
chmod +x $BIN;
PORT=8080;
$BIN --port=$PORT >/tmp/server.log 2>&1 &
PID=$!;
cleanup() { kill $PID >/dev/null 2>&1 || true; };
trap cleanup EXIT;
for i in 1 2 3 4 5; do
if curl -fsS http://127.0.0.1:$PORT/healthz >/dev/null; then break; fi;
sleep 0.2;
done;
curl -fsS http://127.0.0.1:$PORT/healthz;"""

def smoke_test_http(binary, description = "Smoke test: start server and hit /healthz", max_retries = 1, max_duration_seconds = 60):
    return action(
        description = description,
        command = smoke_test_command,
        policy = policy(
            max_retries = max_retries,
            max_duration_seconds = max_duration_seconds,
        ),
        inputs = {
            "BIN": binary,
        },
        env = {
            "GODEBUG": "madvdontneed=1",
        },
    )

build_api = go_build(
    name = "api-server",
    pkg = "./cmd/api-server",
    ldflags = "-s -w",
    max_retries = 2,
    max_duration_seconds = 300,
)

tests = go_test(
    pkg = "./...",
    description = "Unit tests (all packages)",
    max_retries = 0,
    max_duration_seconds = 900,
)

package_api = tar_gz(
    name = "api-server.tar.gz",
    input_file = build_api.outputs["OUT"],
    description = "Package api-server binary",
)

smoke = smoke_test_http(
    binary = build_api.outputs["OUT"],
    description = "Smoke test api-server (/healthz)",
    max_retries = 2,
    max_duration_seconds = 90,
)

workflow(
    name = "build",
    description = "Build a small Go HTTP service",
    goals = [
        build_api.outputs["OUT"],
    ],
)

workflow(
    name = "build_and_test",
    description = "Build, test, package, and smoke-test a small Go HTTP service",
    goals = [
        tests.stdout,
        package_api.outputs["OUT"],
        smoke.stdout,
    ],
)
