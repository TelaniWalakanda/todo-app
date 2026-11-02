import { useEffect, useState } from 'react'
import { FiAlertCircle, FiInbox } from 'react-icons/fi'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import ConfirmDialog from './components/ConfirmDialog'
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodoDone,
  updateTodo
} from './api/todos'

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadTodos = async () => {
      try {
        const data = await getTodos();
        if (!ignore) setTodos(data);
      } catch (error) {
        console.error("Error loading todos:", error);
        if (!ignore) setLoadError("Could not load your tasks.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadTodos();

    return () => {
      ignore = true;
    };
  }, []);

  const runAction = async (action, fallbackMessage) => {
    setActionError("");
    try {
      await action();
      return true;
    } catch (error) {
      console.error(fallbackMessage, error);
      setActionError(error.response?.data?.message || fallbackMessage);
      return false;
    }
  };

  const handleAdd = (todo) =>
    runAction(async () => {
      const created = await createTodo(todo);
      setTodos((prev) => [...prev, created]);
    }, "Could not add the task.");

  const handleUpdate = (id, changes) =>
    runAction(async () => {
      const updated = await updateTodo(id, changes);
      setTodos((prev) => prev.map((item) => (item._id === id ? updated : item)));
    }, "Could not update the task.");

  const handleToggleDone = (id) =>
    runAction(async () => {
      const updated = await toggleTodoDone(id);
      setTodos((prev) => prev.map((item) => (item._id === id ? updated : item)));
    }, "Could not change the task status.");

  const handleRequestDelete = (todo) => setTodoToDelete(todo);

  const cancelDelete = () => {
    if (!deleting) setTodoToDelete(null);
  };

  const confirmDelete = async () => {
    if (!todoToDelete || deleting) return;

    const id = todoToDelete._id;

    setDeleting(true);
    await runAction(async () => {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((item) => item._id !== id));
    }, "Could not delete the task.");
    setDeleting(false);
    setTodoToDelete(null);
  };

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);
  const hasTodos = todos.length > 0;

  return (
    <>
      <section
        id="center"
        className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-indigo-50 to-slate-100 px-4 py-12"
      >
        <div className="w-full max-w-lg">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Task Manager
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Keep track of what needs doing.
            </p>
          </header>

          <TodoForm onAdd={handleAdd} />

          {actionError && (
            <p
              role="alert"
              className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              <FiAlertCircle className="size-4 shrink-0" />
              {actionError}
            </p>
          )}

          {loading && (
            <ul className="mt-8 flex flex-col gap-3" aria-hidden="true">
              {[0, 1, 2].map((placeholder) => (
                <li
                  key={placeholder}
                  className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-white/70"
                />
              ))}
            </ul>
          )}

          {!loading && loadError && (
            <p
              role="alert"
              className="mt-8 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              <FiAlertCircle className="size-4 shrink-0" />
              {loadError}
            </p>
          )}

          {!loading && !loadError && !hasTodos && (
            <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center">
              <FiInbox className="size-6 text-slate-400" />
              <p className="text-sm font-medium text-slate-600">No tasks yet</p>
              <p className="text-xs text-slate-500">
                Add your first task using the form above.
              </p>
            </div>
          )}

          {!loading && !loadError && hasTodos && (
            <>
              <TodoList
                headingId="pending-heading"
                title="To do"
                todos={pendingTodos}
                emptyMessage="Nothing pending."
                onUpdate={handleUpdate}
                onToggleDone={handleToggleDone}
                onRequestDelete={handleRequestDelete}
              />
              <TodoList
                headingId="completed-heading"
                title="Completed"
                todos={completedTodos}
                emptyMessage="Nothing completed yet."
                onUpdate={handleUpdate}
                onToggleDone={handleToggleDone}
                onRequestDelete={handleRequestDelete}
              />
            </>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(todoToDelete)}
        title="Delete this task?"
        message={
          todoToDelete
            ? `"${todoToDelete.title}" will be permanently removed. This action can't be undone.`
            : ""
        }
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}

export default App
