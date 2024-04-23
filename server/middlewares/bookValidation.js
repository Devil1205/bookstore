const { body, validationResult } = require('express-validator');

exports.addBookValidation = {
    errors: [
        body("isbn")
            .isNumeric().withMessage("Invalid ISBN number")
            .isLength({ min: 14, max: 14 }).withMessage("ISBN number must be 14 digit"),

        body("title")
            .notEmpty().withMessage("Title is required"),

        body("author")
            .notEmpty().withMessage("Author is required"),

        body("publisher")
            .notEmpty().withMessage("Publisher is required"),

        body("price")
            .isFloat({ min: 1 }).withMessage("Price must be greater than 0"),

        body("year")
            .isInt({ min: 1000 }).withMessage("Invalid year")
            .isLength({min: 4, max: 4}).withMessage("Year must be 4 digit"),
    ],

    validate: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.errors[0].msg });
        }
        next();
    }
}