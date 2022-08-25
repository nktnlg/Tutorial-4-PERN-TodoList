const express = require("express");
const app = express();
const cors = require("cors");

const pool = require("./db")

//middleware
app.use(cors());
app.use(express.json());

//ROUTES

//create todo
app.post("/todos", async (req, res)=>{
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description])
        res.json(newTodo.rows[0])
        //res = {"todo_id": INT,"description": VARCHAR}
    } catch (error) {
        console.error(error.message);
    }
});

//get all todo
app.get("/todos", async (req, res)=>{
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows)
    } catch (error) {
        console.error(error.message);
    }
});

//get todo
app.get("/todos/:id", async (req, res)=>{
    try {
        const {id} = req.params
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0])
    } catch (error) {
        console.error(error.message);
    }
});

//update todo
app.put("/todos/:id", async (req, res)=>{
    try {
        const {id} = req.params
        const {description} = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
        res.json("Todo was updated")
    } catch (error) {
        console.error(error.message);
    }
});

//delete todo
app.delete("/todos/:id", async (req, res)=>{
    try {
        const {id} = req.params
        const deletedTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was deleted")
    } catch (error) {
        console.error(error.message);
    }
});
// ROUTES END

const PORT = 5000;

app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`)
})