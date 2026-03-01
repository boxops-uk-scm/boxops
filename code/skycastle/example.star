save_greeting = action(
  description = "Save greeting to file",
  command = "echo \"Hello, Skycastle\" > $OUT",
  outputs = {
    "OUT": file(
      description = "File containing the greeting"
    )
  },
)

greet = action(
  description = "Print greeting",
  command = "cat $GREETING",
  inputs = {
    "GREETING": save_greeting.outputs["OUT"]
  }
)

emphasize = action(
  description = "Emphasize greeting",
  command = "echo \"!!! $(cat $GREETING) !!!\" > $OUT",
  policy = policy(
    max_retries = 2,
    max_duration_seconds = 30
  ),
  outputs = {
    "OUT": file()
  },
  inputs = {
    "GREETING": save_greeting.outputs["OUT"]
  }
)

final_greet = action(
  description = "Print emphasized greeting",
  command = "cat $GREETING",
  inputs = {
    "GREETING": emphasize.outputs["OUT"]
  }
)

workflow(
  name = "emphasized_greeting",
  description = "Workflow to create and print an emphasized greeting",
  goals = [final_greet.stdout],
)