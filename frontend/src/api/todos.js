import axios from 'axios';

const BASE_URL = '/api/todos';

export const getTodos = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createTodo = async (todo) => {
  const response = await axios.post(BASE_URL, todo);
  return response.data;
};

export const updateTodo = async (id, changes) => {
  const response = await axios.put(`${BASE_URL}/${id}`, changes);
  return response.data;
};

export const toggleTodoDone = async (id) => {
  const response = await axios.patch(`${BASE_URL}/${id}/done`);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
