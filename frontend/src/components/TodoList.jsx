import TodoCard from './TodoCard'

function TodoList({
  headingId,
  title,
  todos,
  emptyMessage,
  onUpdate,
  onToggleDone,
  onRequestDelete
}) {
  return (
    <section aria-labelledby={headingId} className="mt-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2
          id={headingId}
          className="text-xs font-semibold tracking-wider text-slate-600 uppercase"
        >
          {title}
        </h2>
        <span className="text-xs font-medium text-slate-400">
          {todos.length} {todos.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {todos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-5 text-center text-xs font-medium text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {todos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onUpdate={onUpdate}
              onToggleDone={onToggleDone}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default TodoList
