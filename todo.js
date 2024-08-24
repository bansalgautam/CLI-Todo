import { Command } from "commander";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

const todoFile = fileURLToPath(new URL("todo.json", import.meta.url));

const program = new Command();

program
  .command("todos")
  .description("CLI to manage your todos")
  .version("0.8.0");

program
  .command("todo")
  .description("Manage your todos")
  .option("-l, --list", "List all your todos")
  .option("-a, --add <todo>", "Add a new todo")
  .option("-r, --remove <index>", "Remove a todo")
  .option("-c, --complete <index>", "Mark a todo as complete")
  .action(async (options) => {
    const todos = JSON.parse(await fs.readFile(todoFile, "utf-8"));
    const { list, add, remove, complete } = options;

    if (list) {
      console.log(
        `Found ${todos.length} todos: \n`,
        JSON.stringify(todos, null, 2)
      );
    } else if (add) {
      const todo = {
        name: add,
        id: todos.length + 1,
        status: "pending",
      };
      todos.push(todo);
      await fs.writeFile(todoFile, JSON.stringify(todos, null, 2));
      console.log("Todo added \n", JSON.stringify(todo, null, 2));
    } else if (remove) {
      const id = parseInt(remove, 10);
      const todo = todos.find((todo) => todo.id === id);
      if (todo) {
        todos.splice(todos.indexOf(todo), 1);
        await fs.writeFile(todoFile, JSON.stringify(todos, null, 2));
        console.log("Todo removed \n", JSON.stringify(todo, null, 2));
      }
    } else if (complete) {
      const id = parseInt(complete, 10);
      const todo = todos.find((todo) => todo.id === id);
      if (todo) {
        todo.status = "completed";
        await fs.writeFile(todoFile, JSON.stringify(todos, null, 2));
        console.log("Todo completed \n", JSON.stringify(todo, null, 2));
      }
    }
  });

program.parse();
