import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'

function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setSubmitting(true);
    const added = await onAdd({
      title: trimmedTitle,
      description: description.trim()
    });
    setSubmitting(false);

    if (added) {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            autoComplete="off"
          />
        </div>

        <button
          id="add-task-btn"
          type="submit"
          disabled={submitting}
          className="btn btn-primary"
          style={{ marginTop: '0.25rem' }}
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
