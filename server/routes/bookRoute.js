const { addBook, searchBooks, deleteBook, editBook } = require('../controllers/bookController');
const { isAuthenticated } = require('../middlewares/auth');
const { addBookValidation } = require('../middlewares/bookValidation');

const router = require('express').Router();

//add book route
router.post("/book", isAuthenticated, addBookValidation.errors, addBookValidation.validate, addBook);

//search books route
router.get("/books", isAuthenticated, searchBooks);

//edit book route
router.put("/book/:id", isAuthenticated, addBookValidation.errors, addBookValidation.validate, editBook);

//delete book route
router.delete("/book/:id", isAuthenticated, deleteBook);

module.exports = router;