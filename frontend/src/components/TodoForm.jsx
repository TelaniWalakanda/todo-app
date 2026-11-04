import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateTodo
} from '../utils/validation'

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todo = {
      title: title.trim(),
      description: description.trim()
    };

    const validationError = validateTodo(todo);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);
    const added = await onAdd(todo);
    setSubmitting(false);

    if (added) {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div className="form-card-fields">
        <div>
          <label htmlFor="todo-title" className="form-label">
            Task
          </label>
          <input
            id="todo-title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            maxLength={TITLE_MAX_LENGTH}
            required
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="todo-description" className="form-label">
            Description{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              (optional)
            </span>
          </label>
          <input
            id="todo-description"
            type="text"
            placeholder="Add some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
            maxLength={DESCRIPTION_MAX_LENGTH}
            autoComplete="off"
          />
        </div>

        {error && (
          <p role="alert" className="alert alert-error">
            {error}
          </p>
        )}

        <button
          id="add-task-btn"
          type="submit"
          disabled={submitting}
          className="btn btn-primary form-card-submit"
        >
          {submitting ? (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-spin-slow"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Adding...
            </>
          ) : (
            <>
              <FiPlus style={{ width: 17, height: 17, strokeWidth: 2.5 }} />
              Add Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default TodoForm
