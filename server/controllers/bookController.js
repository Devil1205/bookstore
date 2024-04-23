const Book = require("../models/bookSchema");

//add book controller
exports.addBook = async (req, res, next) => {
    try {
        const { isbn, title, author, publisher, price, year } = req.body;

        //if same ISBN number book is already present
        let book = await Book.findOne({ isbn });
        if (book) {
            return res.status(409).json({
                success: false,
                message: "This book is already present"
            });
        }

        //create new book model and add it to db
        book = new Book({
            isbn,
            title,
            author,
            publisher,
            price,
            year,
            addedBy: req.user._id,
            addedAt: Date.now()
        });

        await book.save();
        return res.status(200).json({
            success: true,
            message: "Book added"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//search books controller
exports.searchBooks = async (req, res, next) => {
    try {
        let query = req.query;

        //converting query object into string and replacing gte & lte with $gte and $lte for mongo query
        let queryStr = JSON.stringify(query);
        queryStr = queryStr.replace(/gte|lte/g, elem => `$${elem}`);
        //converting back to object
        query = JSON.parse(queryStr);

        //fetch all books from db that match the filters
        const books = await Book.find(query).populate("addedBy", "name email");
        return res.status(200).json({
            success: true,
            books
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// //edit book controller
exports.editBook = async (req, res, next) => {
    try {
        const { isbn, title, author, publisher, price, year } = req.body;
        const { id } = req.params;

        let book = await Book.findById(id);

        //if no book found
        if (!book) {
            return res.status(400).json({
                success: true,
                message: "Book doesn't exist"
            });
        }

        //if book is added by some other user
        if (req.user._id.toString() !== book.addedBy.toString()) {
            return res.status(403).json({
                success: true,
                message: "Only own added books are allowed to edit"
            });
        }
        //if same ISBN number book is already present
        if (isbn !== book.isbn && await Book.findOne({ isbn })) {
            return res.status(409).json({
                success: false,
                message: "This book is already present"
            });
        }

        book.isbn = isbn;
        book.title = title;
        book.author = author;
        book.publisher = publisher;
        book.price = price;
        book.year = year;

        await book.save();
        return res.status(200).json({
            success: true,
            message: "Book updated"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//delete book controller
exports.deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        //find and delete the book with given id
        const book = await Book.findById(id);

        //if no book found
        if (!book) {
            return res.status(400).json({
                success: true,
                message: "Book doesn't exist"
            });
        }

        //if book is added by some other user
        if (req.user._id.toString() !== book.addedBy.toString()) {
            return res.status(403).json({
                success: true,
                message: "Only own added books are allowed to delete"
            });
        }

        await Book.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Book deleted"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}