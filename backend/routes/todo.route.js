import express from 'express';
import Todo from '../models/todo.model.js';

const router = express.Router();

//get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Add new todo
router.post("/", async (req, res) => {
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//update todo
router.patch("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
    
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    
    if (req.body.title != null || req.body.title !== undefined) {
        res.todo.title = req.body.title;
    }
    if (req.body.description != null || req.body.description !== undefined) {
        res.todo.description = req.body.description;
    }
    if (req.body.completed != null || req.body.completed !== undefined) {
        res.todo.completed = req.body.completed;
    }
    
        const updatedTodo = await res.todo.save();
        res.json(updatedTodo);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//delete todo
router.delete("/:id", async (req, res) => {
    try {
        await res.todo.remove();
        res.json({ message: 'Deleted Todo' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//get one todo  
router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;