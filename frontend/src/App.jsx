import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiAlertCircle, FiCheck, FiInbox } from 'react-icons/fi'

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchTodos = async () => {
      try {
        const response = await axios.get('/api/todos');
        if (!ignore) setTodos(response.data);
      } catch (error) {
        console.error("Error loading todos:", error);
        if (!ignore) setLoadError("Could not load your tasks.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchTodos();

    return () => {
      ignore = true;
    };
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if(!newTodo) return;

    try {
      const response = await axios.post('/api/todos', {
        title: newTodo,
        description
      });

      setTodos([...todos, response.data]);
      setNewTodo('');
      setDescription('');
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }
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

          <form
            onSubmit={addTodo}
            className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="todo-title"
                className="text-sm font-medium text-slate-700"
              >
                Task
              </label>
              <input
                id="todo-title"
                type="text"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="todo-description"
                className="text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <input
                id="todo-description"
                type="text"
                placeholder="Add a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-800"
            >
              Add Task
            </button>
          </form>

          <section className="mt-8" aria-labelledby="todo-list-heading">
            <div className="mb-3 flex items-baseline justify-between">
              <h2
                id="todo-list-heading"
                className="text-xs font-semibold tracking-wider text-slate-600 uppercase"
              >
                Your tasks
              </h2>
              {!loading && !loadError && (
                <span className="text-xs font-medium text-slate-400">
                  {todos.length} {todos.length === 1 ? "task" : "tasks"}
                </span>
              )}
            </div>

            {loading && (
              <ul className="flex flex-col gap-3" aria-hidden="true">
                {[0, 1, 2].map((placeholder) => (
                  <li
                    key={placeholder}
                    className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-white/70"
                  />
                ))}
              </ul>
            )}

            {!loading && loadError && (
              <p className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <FiAlertCircle className="size-4 shrink-0" />
                {loadError}
              </p>
            )}

            {!loading && !loadError && todos.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center">
                <FiInbox className="size-6 text-slate-400" />
                <p className="text-sm font-medium text-slate-600">No tasks yet</p>
                <p className="text-xs text-slate-500">
                  Add your first task using the form above.
                </p>
              </div>
            )}

            {!loading && !loadError && todos.length > 0 && (
              <ul className="flex flex-col gap-3">
                {todos.map((todo) => (
                  <li
                    key={todo._id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 transition hover:border-indigo-200 hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={
                          todo.completed
                            ? "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
                            : "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 text-transparent"
                        }
                      >
                        <FiCheck className="size-3.5" strokeWidth={3} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3
                          className={
                            todo.completed
                              ? "truncate text-base font-semibold text-slate-400 line-through"
                              : "truncate text-base font-semibold text-slate-900"
                          }
                        >
                          {todo.title}
                        </h3>
                        <p className="mt-1 text-sm break-words text-slate-500">
                          {todo.description}
                        </p>
                      </div>
                      {todo.completed && (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Done
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>
    </>
  )
}

export default App
