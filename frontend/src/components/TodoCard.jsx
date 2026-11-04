import { useState } from 'react'
import confetti from 'canvas-confetti'
import { FiCheck, FiEdit2, FiRotateCcw, FiSave, FiTrash2, FiX } from 'react-icons/fi'
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateTodo
} from '../utils/validation'

const triggerConfetti = (event , color) => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
      particleCount: 100,
      spread: 360,
      startVelocity: 30,
      origin: { x, y },
      ...(color ? { colors: [color] } : {}),
    });

};

const inputClasses =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted shadow-sm transition outline-none focus:border-forest focus:ring-4 focus:ring-forest/15";

const secondaryButtonClasses =
  "inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-ink-soft transition hover:border-sage hover:bg-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-60";

function TodoCard({ todo, onUpdate, onToggleDone, onRequestDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startEditing = () => {
    setTitle(todo.title);
    setDescription(todo.description);
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setError("");
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const changes = {
      title: title.trim(),
      description: description.trim()
    };

    const validationError = validateTodo(changes);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSaving(true);
    const updated = await onUpdate(todo._id, changes);
    setSaving(false);

    if (updated) setIsEditing(false);
  };

  return (
    <li className="rounded-2xl border border-line bg-white shadow-sm shadow-ink/5 transition hover:border-sage hover:shadow-md p-6 h-80">
      {isEditing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`todo-title-${todo._id}`}
              className="text-xs font-medium text-ink-soft"
            >
              Task
            </label>
            <input
              id={`todo-title-${todo._id}`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses}
              maxLength={TITLE_MAX_LENGTH}
              autoFocus
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`todo-description-${todo._id}`}
              className="text-xs font-medium text-ink-soft"
            >
              Description{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id={`todo-description-${todo._id}`}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClasses}
              maxLength={DESCRIPTION_MAX_LENGTH}
            />
          </div>

          {error && (
            <p role="alert" className="alert alert-error">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-forest-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave className="size-3.5" />
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={cancelEditing}
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
                  ? "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-sage-soft text-forest"
                  : "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-sage text-transparent"
              }
            >
              <FiCheck className="size-3.5" strokeWidth={3} />
            </span>

            <div className="min-w-0 flex-1">
              <h3
                className={
                  todo.completed
                    ? "truncate text-base font-semibold text-ink-muted line-through"
                    : "truncate text-base font-semibold text-ink"
                }
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p className="mt-1 text-sm break-words text-ink-soft">
                  {todo.description}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3 justify-end">
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
              onClick={(e) => {
                if (!todo.completed) triggerConfetti(e);
                onToggleDone(todo._id);
              }}
              className={
                todo.completed
                  ? secondaryButtonClasses
                  : "inline-flex items-center gap-1.5 rounded-lg border border-sage bg-sage-soft px-2.5 py-1.5 text-xs font-medium text-forest transition hover:bg-sage-softer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-danger-line bg-danger-soft px-2.5 py-1.5 text-xs font-medium text-danger transition hover:bg-danger-softer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
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
