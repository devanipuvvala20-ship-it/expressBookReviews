const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;

let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    if (!users.find(user => user.username === username)) {

      users.push({
        username: username,
        password: password
      });

      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });

    } else {

      return res.status(409).json({
        message: "User already exists"
      });

    }

  }

  return res.status(400).json({
    message: "Username and password are required"
  });

});


// Get the book list available in the shop

public_users.get('/', function (req, res) {

  res.json(books);

});


// Get book details based on ISBN

public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {

    return res.json(books[isbn]);

  } else {

    return res.status(404).json({
      message: "Book not found"
    });

  }

});


// Get book details based on author

public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;

  const booksByAuthor = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase()
  );

  return res.json(booksByAuthor);

});


// Get all books based on title

public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;

  const booksByTitle = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase()
  );

  return res.json(booksByTitle);

});


// Get book review

public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {

    return res.json(books[isbn].reviews);

  } else {

    return res.status(404).json({
      message: "Book not found"
    });

  }

});


// ======================================================
// TASK 10 - Get all books using Axios and async/await
// ======================================================

async function getAllBooks() {

  try {

    const response = await axios.get('http://localhost:5000/');

    return response.data;

  } catch (error) {

    console.error("Error getting all books:", error.message);

  }

}


// ======================================================
// TASK 11 - Get book details by ISBN using Axios
// ======================================================

async function getBookByISBN(isbn) {

  try {

    const response = await axios.get(
      `http://localhost:5000/isbn/${isbn}`
    );

    return response.data;

  } catch (error) {

    console.error("Error getting book by ISBN:", error.message);

  }

}


// ======================================================
// TASK 12 - Get books by Author using Axios
// ======================================================

async function getBooksByAuthor(author) {

  try {

    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );

    return response.data;

  } catch (error) {

    console.error("Error getting books by author:", error.message);

  }

}


// ======================================================
// TASK 13 - Get books by Title using Axios
// ======================================================

async function getBooksByTitle(title) {

  try {

    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );

    return response.data;

  } catch (error) {

    console.error("Error getting books by title:", error.message);

  }

}


module.exports.general = public_users;

// Export async functions for Tasks 10-13
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;