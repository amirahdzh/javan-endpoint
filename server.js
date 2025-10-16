// server.js
const express = require("express");
const app = express();
app.use(express.json());

// Serve static files from the public folder (index.html, client JS, CSS, ...)
app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 3000;

// In-memory storage (array)
let users = [];
let nextId = 1;

// Serve index.html for root so the UI is accessible in the browser
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Get single item
app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = users.find((it) => it.id === id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

// Create user
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const newUser = {
    id: nextId++,
    name,
    email: email ?? null,
    age: age ?? null,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user
app.put("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = users.find((it) => it.id === id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  const { name, email, age } = req.body;
  if (name !== undefined) item.name = name;
  if (email !== undefined) item.email = email;
  if (age !== undefined) item.age = age;
  res.json(item);
});

// Delete item
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = users.findIndex((it) => it.id === id);
  if (idx === -1) return res.status(404).json({ error: "Item not found" });
  const removed = users.splice(idx, 1)[0];
  res.json(removed);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
