import { useEffect, useState } from 'react'
import { FiAlertCircle, FiInbox } from 'react-icons/fi'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import ConfirmDialog from './components/ConfirmDialog'
import ProgressChart from './components/ProgressChart'
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
      {/* Animated background */}
      <div className="app-bg" aria-hidden="true">
        <div className="grid-overlay" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="app-container">
        <div className="app-inner">

          {/* Header */}
          <header className="app-header">
            <h1 className="text-2xl font-bold text-center pb-4">
              Task Manager
            </h1>
            <h2 className="app-title">Stay on Track,<br />Get Things Done.</h2>
            <p className="app-subtitle">Organize your tasks with clarity and flow.</p>
          </header>

          {/* Add task form with progress doughnut */}
          <div className="form-row">
            <TodoForm onAdd={handleAdd} />
            {!loading && !loadError && (
              <ProgressChart completed={completedTodos.length} total={todos.length} />
            )}
          </div>

          {/* Action error */}
          {actionError && (
            <p
              role="alert"
              className="alert alert-error"
              style={{ marginTop: '1rem' }}
            >
              <FiAlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              {actionError}
            </p>
          )}

          {/* Loading skeletons */}
          {loading && (
            <ul
              className="lists-grid"
              aria-hidden="true"
              style={{ marginTop: '1.5rem' }}
            >
              {[0, 1].map((col) => (
                <li key={col} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="skeleton"
                      style={{
                        height: '80px',
                        animationDelay: `${(col * 3 + i) * 0.08}s`,
                      }}
                    />
                  ))}
                </li>
              ))}
            </ul>
          )}

          {/* Load error */}
          {!loading && loadError && (
            <p role="alert" className="alert alert-error" style={{ marginTop: '2rem' }}>
              <FiAlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              {loadError}
            </p>
          )}

          {/* Empty state */}
          {!loading && !loadError && !hasTodos && (
            <div className="empty-state-full" style={{ marginTop: '2rem' }}>
              <div className="empty-icon">
                <FiInbox />
              </div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-ink-soft)' }}>
                No tasks yet
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)', maxWidth: '220px' }}>
                Add your first task above to get started.
              </p>
            </div>
          )}

          {/* Todo lists */}
          {!loading && !loadError && hasTodos && (
            <div className="lists-grid" style={{ marginTop: '1.5rem' }}>
              <TodoList
                headingId="pending-heading"
                title="To Do"
                variant="pending"
                todos={pendingTodos}
                emptyMessage="Nothing pending — great work!"
                onUpdate={handleUpdate}
                onToggleDone={handleToggleDone}
                onRequestDelete={handleRequestDelete}
              />
              <TodoList
                headingId="completed-heading"
                title="Completed"
                variant="completed"
                todos={completedTodos}
                emptyMessage="Nothing completed yet."
                onUpdate={handleUpdate}
                onToggleDone={handleToggleDone}
                onRequestDelete={handleRequestDelete}
              />
            </div>
          )}

        </div>
      </div>

      <ConfirmDialog
        open={Boolean(todoToDelete)}
        title="Delete this task?"
        message={
          todoToDelete && (
            <>
              <strong>{todoToDelete.title}</strong> will be permanently removed. This action can&apos;t be undone.
            </>
          )
        }
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  )
}

export default App
