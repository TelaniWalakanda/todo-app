export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;

export const validateTitle = (title) => {
  if (!title.trim()) {
    return "Task cannot be empty.";
  }
  if (title.trim().length > TITLE_MAX_LENGTH) {
    return `Task cannot exceed ${TITLE_MAX_LENGTH} characters.`;
  }
  return "";
};

export const validateDescription = (description) => {
  if (description.trim().length > DESCRIPTION_MAX_LENGTH) {
    return `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`;
  }
  return "";
};

export const validateTodo = (todo) =>
  validateTitle(todo.title || "") || validateDescription(todo.description || "");
