import { useState } from 'react'
import { FiCheck, FiEdit2, FiRotateCcw, FiSave, FiTrash2, FiX } from 'react-icons/fi'

const inputClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15";

const secondaryButtonClasses =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-60";

function TodoCard({ todo, onUpdate, onToggleDone, onRequestDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setTitle(todo.title);
    setDescription(todo.description);
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setSaving(true);
    const updated = await onUpdate(todo._id, {
      title: trimmedTitle,
      description: description.trim()
    });
    setSaving(false);

    if (updated) setIsEditing(false);
  };

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 transition hover:border-indigo-200 hover:shadow-md sm:p-5">
      {isEditing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`todo-title-${todo._id}`}
              className="text-xs font-medium text-slate-600"
            >
              Task
            </label>
            <input
              id={`todo-title-${todo._id}`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses}
              autoFocus
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`todo-description-${todo._id}`}
              className="text-xs font-medium text-slate-600"
            >
              Description{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id={`todo-description-${todo._id}`}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave className="size-3.5" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className={secondaryButtonClasses}
            >
              <FiX className="size-3.5" />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
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
              {todo.description && (
                <p className="mt-1 text-sm break-words text-slate-500">
                  {todo.description}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3 justify-end">
            <button
              type="button"
              onClick={startEditing}
              className={secondaryButtonClasses}
            >
              <FiEdit2 className="size-3.5" />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onToggleDone(todo._id)}
              className={
                todo.completed
                  ? secondaryButtonClasses
                  : "inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              }
            >
              {todo.completed ? (
                <FiRotateCcw className="size-3.5" />
              ) : (
                <FiCheck className="size-3.5" />
              )}
              {todo.completed ? "Undo" : "Mark as done"}
            </button>

            <button
              type="button"
              onClick={() => onRequestDelete(todo)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              <FiTrash2 className="size-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoCard
