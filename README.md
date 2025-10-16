# JAVAN TECHNICAL TEST – Backend Developer

This project is a **technical test submission** for the **Backend Developer Internship at Javan**.
It demonstrates a clean and minimal Express.js application that serves both backend API routes and a simple front-end interface for interacting with them.

---

## 🧩 Overview

When a user accesses the root (`/`), they’re greeted with a playful interface offering two interfaces:

- **Simple View** – shows the basic required API endpoints:

  - `GET /users` → Get all users
  - `POST /users` → Create a new user
  - `GET /users/:id` → Get user by ID
    These are explained in an interactive, developer-friendly way using tooltips and inline notes.

- **Less-Simple View** – a richer CRUD layout (template only, not fully implemented yet).

The design intentionally keeps things simple, focusing on logic and interactivity rather than UI flashiness.

---

## 🧠 Features

- **Interactive explanation layer** – tooltips (`?` icons) that describe each endpoint’s purpose and logic.
- **Dynamic toggling** – switch between “Simple” and “Less-Simple” views inside a shared box container.
- **Basic API demo** – shows request/response behavior without requiring external tools like Postman.
- **Light humor** – a touch of personality, because backend doesn’t have to be boring.

---

## 🏗️ Tech Stack

| Component             | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| **Node.js / Express** | Backend framework handling API endpoints and static file serving |
| **HTML / CSS / JS**   | Simple front-end interface for endpoint visualization            |
| **No database**       | Data stored in-memory for demonstration                          |
| **VPS**               | Use my privilege for having a VPS                                |

---

## 📁 Project Structure

```
.
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── server.js
├── package.json
└── README.md
```

- `index.html` – main view containing the toggle and endpoint explanations
- `script.js` – client-side behavior for view switching and API interaction
- `styles.css` – basic layout and tooltip styling
- `server.js` – Express app serving static files and routes

---

## 🧪 API Endpoints (Simple View)

| Method | Endpoint     | Description                           |
| ------ | ------------ | ------------------------------------- |
| `GET`  | `/users`     | Fetch all users                       |
| `GET`  | `/users/:id` | Fetch a single user by ID             |
| `POST` | `/users`     | Create a new user (accepts JSON body) |

Example `POST` body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 27
}
```

Response:

```json
{
  "id": 4,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 27,
  "createdAt": "2025-10-16T12:00:00.000Z"
}
```

---

## 🚀 Deployed demo

A public demo of this project is available at the domain:

```
https://javanbe.amiw.dev
```

Note: the backend uses in-memory storage (no persistent database). Data will reset when the server restarts.

---

## 👩‍💻 Author

**Amirah Dzatul Himmah**
📧 [amirahdzh@gmail.com](mailto:amirahdzh@gmail.com)
🌐 [https://amiw.dev](https://amiw.dev)
