# Task Manager – Backend

The API for my todo app. It's a small Express 5 server that keeps the todos in MongoDB
using Mongoose, with the usual CRUD routes plus a `PATCH` for ticking a task off.

## Built with

- **Node.js** with ES modules (`"type": "module"` is set in the root package.json)
- **Express 5**
- **Mongoose 9** for the schema and queries
- **MongoDB** – I use an Atlas cluster, but a local `mongod` works too
- **dotenv** for the connection string
- **nodemon** so the server restarts when I save a file

## Folder layout

```
backend/
├── config/db.js          connects mongoose to MONGODB_URI
├── models/todo.model.js  the Todo schema (title, description, completed)
├── routes/todo.route.js  the /api/todos routes
└── server.js             express setup and app.listen
```

There's no `package.json` in here on purpose. Everything — backend and frontend —
is installed from the single `package.json` in the repo root: `npm install` there,
then `npm run dev` to start the API (it runs `nodemon backend/server.js`).

## Setting up MongoDB

The connection string comes from `MONGODB_URI`. Copy the example file in the repo root
and fill it in:

```bash
cp .env.example .env            # mac/linux
copy .env.example .env          # windows cmd
Copy-Item .env.example .env     # windows powershell
```

Then put one of these in it:

```env
# Atlas
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/todos?retryWrites=true&w=majority"

# local
MONGODB_URI="mongodb://127.0.0.1:27017/todos"
```

Keep `.env` in the repo root. `dotenv.config()` looks for it in the folder you run
the command from, so starting from the root is the path of least resistance (a
`backend/.env` works if you `cd backend` first, but I wouldn't bother). The file is
gitignored; `.env.example` is the one that gets committed.

### If you're using Atlas

1. Make a free cluster on https://cloud.mongodb.com.
2. Under Database Access, add a user with a password.
3. Under Network Access, allow your IP. `0.0.0.0/0` is fine while developing, just
   remember it's wide open.
4. Grab the driver connection string and paste your password in. If the password has
   characters like `@`, `:` or `/`, URL-encode them or the URI won't parse.
5. Put a database name just before the `?`, e.g. `...mongodb.net/todos?retryWrites...`.
   Without it Atlas dumps everything into the default `test` database, which I learnt
   the hard way.

### If you're using a local server

Install MongoDB Community, make sure `mongod` is up on 27017, and use the
`mongodb://127.0.0.1:27017/todos` string. The database and collection are created the
first time you add a task. I use `127.0.0.1` rather than `localhost` because on Windows
`localhost` sometimes resolves to `::1` and the connection hangs.

## Running it

From the repo root:

```bash
npm install
npm run dev
```

You should see:

```
Server is running on port 5000 : http://localhost:5000
MongoDB Connected: <host> under the name: todos
```

The port is hard-coded to 5000 in `server.js`. Also note the `app.listen` comes before
`connectDB()` and isn't awaited, so the API is briefly accepting requests before the
database is ready, and if the connection fails the process exits with code 1.

## Routes

Everything hangs off `/api/todos`:

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| GET | `/api/todos` | – | all todos |
| GET | `/api/todos/:id` | – | one todo |
| POST | `/api/todos` | `{ title, description? }` | 201 + the new todo |
| PUT | `/api/todos/:id` | `{ title?, description? }` | updated todo |
| PATCH | `/api/todos/:id/done` | – | flips `completed` |
| DELETE | `/api/todos/:id` | – | `{ message, id }` |

A todo looks like this:

```json
{
  "_id": "66f0c2b1e4b0a1f2c3d4e5f6",
  "title": "Write the README",
  "description": "Frontend and backend",
  "completed": false,
  "createdAt": "2025-09-22T10:12:44.512Z",
  "updatedAt": "2025-09-22T10:12:44.512Z"
}
```

Validation is done in the route before saving: title is required on create and can't
be blank, title max 100 characters, description max 500. Bad input gets a `400` with
`{ "message": "..." }`, a missing id gets `404`, anything else `500`.

Quick check:

```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Buy milk\"}"
```

## Limitations and Assumptions

- No auth. Every route is open and returns everyone's todos.
- No paging, search or sorting — `GET /api/todos` sends the whole collection.
- `cors` is in the dependencies but I never mounted it in `server.js`. The front end
  doesn't need it because Vite proxies `/api` during development. If you call the API
  from another origin, add `app.use(cors())` with an origin allow-list.
- `PORT` is mentioned in `.env.example` but `server.js` ignores it — it's always 5000.
- `PATCH /:id/done` only toggles; there's no way to set `completed` to a specific value.
- No tests and no graceful shutdown — Ctrl+C just kills it.
