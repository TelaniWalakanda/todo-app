import express from 'express';
import Todo from '../models/todo.model.js';

const router = express.Router();

const sendError = (res, err) => {
    const isClientError = err.name === 'CastError' || err.name === 'ValidationError';
    res.status(isClientError ? 400 : 500).json({ message: err.message });
};

const isValidText = (value) => typeof value === 'string';

// Rejects non-string fields and a missing or blank title
const validateBody = (body, { titleRequired }) => {
    const { title, description } = body ?? {};

    if (title === undefined) {
        return titleRequired ? 'Title is required' : null;
    }
    if (!isValidText(title)) {
        return 'Title must be a string';
    }
    if (title.trim() === '') {
        return 'Title cannot be empty';
    }
    if (description !== undefined && !isValidText(description)) {
        return 'Description must be a string';
    }
    return null;
};

const findTodo = async (id, res) => {
    const todo = await Todo.findById(id);
    if (!todo) {
        res.status(404).json({ message: 'Todo not found' });
        return null;
    }
    return todo;
};

//get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        sendError(res, err);
    }
});

//get one todo
router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (err) {
        sendError(res, err);
    }
});

//Add new todo
router.post("/", async (req, res) => {
    const validationError = validateBody(req.body, { titleRequired: true });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const todo = new Todo({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        sendError(res, err);
    }
});

//update todo title/description
router.put("/:id", async (req, res) => {
    const validationError = validateBody(req.body, { titleRequired: false });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const todo = await findTodo(req.params.id, res);
        if (!todo) return;

        if (req.body.title !== undefined) {
            todo.title = req.body.title;
        }
        if (req.body.description !== undefined) {
            todo.description = req.body.description;
        }

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        sendError(res, err);
    }
});

//toggle todo done status
router.patch("/:id/done", async (req, res) => {
    try {
        const todo = await findTodo(req.params.id, res);
        if (!todo) return;

        todo.completed = !todo.completed;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        sendError(res, err);
    }
});

//delete todo
router.delete("/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        res.json({ message: 'Deleted Todo', id: req.params.id });
    } catch (err) {
        sendError(res, err);
    }
});

export default router;
