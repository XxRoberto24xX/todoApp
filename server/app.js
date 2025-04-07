import express from 'express';
import cors from 'cors'; 
import {
    getTodoById,
    getUserTodos,
    getShareTodoById,
    getUserByid,
    getUserByEmail,
    createTodo,
    deleteTodo,
    toggleComplete,
    shareTodo,
} from "./database.js";

//BACKEND API OPENING

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    Credentials: true, 
};
const app = express();
const port = 8080;

app.use(express.json());    // Middleware to parse JSON request bodies
app.use(cors(corsOptions)); // Enable CORS for all routes

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});



//BACKEND API ENDPOINTS

//Todos management
app.get("/todos/:id", async (req, res) => {
    const todo = await getTodoById(req.params.id);
    res.status(200).send(todo);
});

app.get("/todos/user/:user_id", async (req, res) => {
    const todos = await getUserTodos(req.params.user_id);
    res.status(200).send(todos);
});

app.put("/todos/:id", async (req, res) => {
    const {value} = req.body;
    const todos = await toggleComplete(req.params.id, value);
    res.status(200).send(todos);
});

app.post("/todos", async (req, res) => {
    const {user_id, title} = req.body;
    const todo = await createTodo(user_id, title);
    res.status(201).send(todo);
});

app.delete("/todos/:id", async (req, res) => {
    await deleteTodo(req.params.id);
    res.status(200).send({message: "Todo deleted successfully"});
})



//Shared Todos management
app.get("/todos/shared_todos/:id", async (req, res) => {
    const todo = await getShareTodoById(req.params.id);
    const author = await getUserByid(todo.user_id);
    const shared_with = await getUserByid(todo.shared_with_id);
    res.status(200).send({author, shared_with});
});

app.post("/todos/shared_todos", async (req, res) => {
    const { todo_id, user_id, email} = req.body;
    const userToShare = await getUserByEmail(email);
    const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
    res.status(201).send(sharedTodo);
});



//User management
app.get("/users/:id", async (req, res) => {
    const user = await getUserByid(req.params.id);
    res.status(200).send(user);
});