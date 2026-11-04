# Task Manager – Frontend

This is the React front end for my todo app. It has a form for adding tasks, two
columns for pending and completed items, a doughnut chart showing how much is done,
and it talks to the Express API in `../backend`.

## Built with

- **React 19** with Vite 8 (`npm run dev`, `npm run build`)
- **Tailwind CSS v4** through `@tailwindcss/vite`, plus a fair amount of plain CSS in
  `src/index.css` for the cards, background orbs and animations
- **Axios** for talking to the API
- **react-icons** (Feather set) for the small icons
- **canvas-confetti** for the little celebration when you tick a task off
- **ESLint 10** with the React hooks and react-refresh plugins

## Folder layout

Most of the work happens in `src/`. Inside it:

**`api/todos.js`** – all the axios calls live here, one function per endpoint
(`getTodos`, `createTodo`, `updateTodo`, `toggleTodoDone`, `deleteTodo`).

**`components/`** – one file per piece of the UI:

- `TodoForm.jsx` – the form at the top for adding a task
- `TodoList.jsx` – a column; it renders the cards and the empty message
- `TodoCard.jsx` – a single task, including the inline edit mode and the confetti
- `ProgressChart.jsx` – the doughnut plus the done/remaining counts (This was done as an extra work I have done to showcase a summary)
- `ConfirmDialog.jsx` – the "delete this task?" popup

**`utils/validation.js`** – the title and description length rules, shared by the form
and the card so both complain the same way.

**`App.jsx`** – loads the todos on mount and owns the add/edit/toggle/delete handlers,
then splits the list into pending and completed for the two columns.

**`index.css`** – the tailwind import, the colour tokens and all the custom styles
(cards, background orbs, animations).

**`main.jsx`** – just mounts `<App />`.

Outside `src/` there's little to worry about: `public/` holds the favicon, `icons.svg`
and the `side-img.webp` illustration, `vite.config.js` wires up tailwind and the dev
proxy to `localhost:5000`, and `eslint.config.js` is the usual Vite lint setup.

## Running it

You need Node 20.19+ or 22.12+ (Vite 8 won't start on older versions). I'm on Node 22.

The front end is no use on its own — it needs the API, so start both.

First install the dependencies. The backend packages live in the repo root, the
frontend ones in this folder:

```bash
# in the repo root
npm install

# then
cd frontend
npm install
```

Start the API in one terminal (from the repo root):

```bash
npm run dev   # http://localhost:5000
```

And the front end in another:

```bash
cd frontend
npm run dev   # http://localhost:5173
```

Open http://localhost:5173.

If the page loads but says "Could not load your tasks.", the API probably isn't
running or couldn't reach MongoDB — check the other terminal first.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run lint` | ESLint |

### Why there's no CORS setup

`src/api/todos.js` requests `/api/todos` on the same origin. In `vite.config.js` I
proxy `/api` to `http://localhost:5000`, so during development the browser never makes
a cross-origin request. If you build the app and serve `dist/` somewhere else, that
proxy is gone and you'll need to either put the API behind the same host (nginx/vercel
rewrite etc.) or point the code at a real API URL and enable CORS on the server.

## Limitations and Assumptions

- There's no login. Everything is one shared list, so anyone who opens the app sees
  the same tasks.
- The API URL is hard-coded as `/api/todos`. If you deploy the front end on its own
  you'll have to change that (a `VITE_API_URL` env var would be the easy fix).
- Tasks are only fetched on page load. After adding or editing, the state is updated
  locally from the response, so a manual refresh is the only way to pull changes made
  elsewhere.
- Title is capped at 100 characters and description at 500. The same numbers are
  duplicated in `backend/models/todo.model.js` — change both or the server will
  reject what the form allows.
- The layout switches to one column under 640px and hides the header illustration
  there.
- No tests yet. `npm run lint` and `npm run build` are the only checks.
- Don't drop the `@theme` block at the top of `index.css` — the Tailwind classes in
  `TodoCard.jsx` (`text-ink`, `border-line`, etc.) depend on those colour tokens.
