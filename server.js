require("dotenv").config(); //load environment variables from .env file
const express = require("express"); //lib
const mongoose = require("mongoose"); 
const cors = require("cors"); //allows to go into mutiple domains 

const app = express(); //create an instance of express
app.use(cors()); //use cors
app.use(express.json()); //parse JSON request bodies

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Todo = mongoose.model("Todo", todoSchema); 

const updateTodo = async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const body = req.body || {};
  let updated = false;

  const nextTitle = body.title;
  if (nextTitle !== undefined) {
    const trimmedTitle = nextTitle.trim();
    updated = true;
  }

  if (typeof body.completed === "boolean") {
    todo.completed = body.completed;
    updated = true;
  }

  if (!updated) {
    console.log("in 400");
    return res.status(400).json({ error: "Send a title or completed value to update" });
  }

 const success = await Todo.updateOne({ _id: req.params.id }, { $set: { completed: todo.completed, title: nextTitle } });
  const newTodo = await Todo.findById(req.params.id);
  res.json(newTodo);
};

//get request
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos); //sends back as json file
});

//create a todo from the frontend add button
app.post("/api/todos", async (req, res) => {
  // Turns the frontend request body into a clean todo object.
  const todo = new Todo({
    title: req.body.title,
    completed: req.body.completed || false
  });

  if (!todo.title) {
    return res.status(400).json({ error: "title is required" });
  }

  // Saves the new todo to the database.
  await todo.save();

  res.status(201).json(todo);
});

//update todo text or checked/unchecked status from the frontend
app.patch("/api/todos/:id", updateTodo);
app.put("/api/todos/:id", updateTodo);

//delete a todo from the frontend trash button
app.delete("/api/todos/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json(todo);
});

const port = process.env.PORT || 3001; //set the port
    app.listen(port, () => { //start the server
      console.log(`Server is up and running on port ${port}!`);
    });
