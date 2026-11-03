import TodoCard from './TodoCard'

function TodoList({
  headingId,
  title,
  variant = 'pending',
  todos,
  emptyMessage,
  onUpdate,
  onToggleDone,
  onRequestDelete
}) {
  return (
    <section aria-labelledby={headingId} className="list-section">
      <div className="list-header">
        <h2 id={headingId} className="list-title">
          <span
            className={`list-title-dot ${variant}`}
            aria-hidden="true"
          />
          {title}
        </h2>
        <span className="list-count">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {todos.length === 0 ? (
        <p className="empty-state">{emptyMessage}</p>
      ) : (
        <ul
          style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
          aria-label={`${title} tasks`}
        >
          {todos.map((todo, index) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              index={index}
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
