# IPFS
ipfs init --profile server
ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001
ipfs config Addresses.Gateway /ip4/127.0.0.1/tcp/8080
ipfs config Routing.Type none
ipfs daemon &

# Authoring Workflows

## Minimal Action
```
action(
  command="echo 'Hello, World!'
)
```

## Action Description
```
action(
  description="Print greeting"
  command="echo 'Hello, World!'
)
```

## Action Environment variables
```
action(
  description="Print greeting"
  command="echo $GREETING"
  env={
    "GREETING"="Hello, World!"
  }
)
```

## Action Outputs
```
write_greeting = action(
  description="Write greeting to file",
  command="echo 'Hello, World!' > $OUT",
  outputs={
    "OUT"=file(
      description="Greeting file"
    )
  }
)
```

## Action Inputs
```
print_greeting_from_file = action(
  description="Print a greeting from a file",
  command="cat $GREETING",
  inputs={
    write_greeting.outputs["OUT"]
  }
)
```

## Action Policy
```
action(
  description="Print greeting"
  command="echo 'Hello, World!'"
  policy=policy(
    max_retries=2
    max_duration_seconds=30
  )
)
```

## Workflow Inputs
```

```