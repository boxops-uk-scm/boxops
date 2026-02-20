save_greeting = action(
  name = "Save greeting to file",
  cmd = "echo \"Hello, Skycastle\" > $OUT",
  outputs = {
    "OUT": file()
  },
)

greet = action(
  name = "Print greeting",
  cmd = "cat $GREETING",
  inputs = {
    "GREETING": save_greeting.outputs["OUT"]
  }
)

emphasize = action(
  name = "Emphasize greeting",
  cmd = "echo \"!!! $(cat $GREETING) !!!\" > $OUT",
  outputs = {
    "OUT": file()
  },
  inputs = {
    "GREETING": save_greeting.outputs["OUT"]
  }
)

final_greet = action(
  name = "Print emphasized greeting",
  cmd = "cat $GREETING",
  inputs = {
    "GREETING": emphasize.outputs["OUT"]
  }
)