const express = require('express');
const app = express();

app.use(express.json());

const users = [];

// GET all users
app.get('/users', (req, res) => {
  res.json(users);
});

// POST a new user
app.post('/users', (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});

// GET a specific user
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express server is listening on port ${PORT}`);
});
