const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      // isValid checks if the username already exists in the users array
      if (!isValid(username)) { 
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user (Username or Password not provided)."});
  });

// Task 10: Get the book list available in the shop using promises/async-await
public_users.get('/', async function (req, res) {
    try {
      // Simulating an asynchronous operation
      const getBooks = new Promise((resolve, reject) => {
          resolve(books);
      });
  
      const bookList = await getBooks;
      res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
      res.status(500).json({message: "Error retrieving books"});
    }
  });

// Task 11: Get book details based on ISBN using Promises/Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const getBook = new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject({ status: 404, message: "Book not found" });
            }
        });

        const bookDetails = await getBook;
        res.status(200).json(bookDetails);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
});
  
// Task 12: Get book details based on author using Promises/Async-Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
            const book_keys = Object.keys(books);
            let filtered_books = [];
            
            book_keys.forEach((key) => {
                if (books[key].author === author) {
                    filtered_books.push({
                        "isbn": key,
                        "title": books[key].title,
                        "reviews": books[key].reviews
                    });
                }
            });

            if (filtered_books.length > 0) {
                resolve(filtered_books);
            } else {
                reject({ status: 404, message: "No books found by this author" });
            }
        });

        const booksByAuthor = await getBooksByAuthor;
        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
});

// Task 13: Get book details based on title using Promises/Async-Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = new Promise((resolve, reject) => {
            const book_keys = Object.keys(books);
            let filtered_books = [];

            book_keys.forEach((key) => {
                if (books[key].title === title) {
                    filtered_books.push({
                        "isbn": key,
                        "author": books[key].author,
                        "reviews": books[key].reviews
                    });
                }
            });

            if (filtered_books.length > 0) {
                resolve(filtered_books);
            } else {
                reject({ status: 404, message: "No books found with this title" });
            }
        });

        const booksByTitle = await getBooksByTitle;
        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
      res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      res.status(404).json({message: "Book not found"});
    }
  });

module.exports.general = public_users;