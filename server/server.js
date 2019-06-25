// Implementation of POST, GET, DELETE and PATCH endpoints
const {Restaurant} = require('../models/restaurant.js');

const express = require('express');
const port = 3000;
const app = express();

// Initailization
let lazeez = new Restaurant('Lazeez');
let restaurant_list = {};

// Restaurant
// GET - Restaurant List
// POST - Create Restaurant
// DELETE - Restaurant
app.get('/restaurant', (req, res) => {
    res.send(restaurant_list);
});
// app.post();
// app.delete();
//
// // Restuarant Menu
// // GET - Restaurant Menu
// // POST - Create Restaurant Menu
// // PATCH - Update Menu Items
// // DELETE - Menu Item
// app.get();
// app.post();
// app.put();
// app.delete();
//
// // User
// // POST - Login
// // POST - Logout
// app.post();
// app.post();

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
