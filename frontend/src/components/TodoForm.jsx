import { useState } from 'react'

const inputClasses =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm transition outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15";

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8 max-w-lg"
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClasses}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="todo-description"
          className="text-sm font-medium text-slate-700"
        >
          Description <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="todo-description"
          type="text"
          placeholder="Add a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-400"
      >
        {submitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

export default TodoForm
