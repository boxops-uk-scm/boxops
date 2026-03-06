.PHONY: build run

build:
	@go build -o bin/kiln cmd/kiln/main.go

test:
	@go test -v ./...

run: build
	@./bin/kiln