const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    phone: {
        type: Number,
        minLength: [10, "Invalid phone number"],
        maxLength: [10, "Invalid phone number"],
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be atleast 6 characters"],
        select: false
    },
    resetToken: String,
    resetTokenExpire: Date,
    createdAt: Date,
});

User.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

User.methods.generateToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    return token;
}

User.methods.matchPassword = async function (password) {
    let matched = await bcrypt.compare(password, this.password);
    return matched;
}

User.methods.generateResetToken = function () {
    let token = crypto.randomBytes(20).toString("hex");
    this.resetToken = crypto.createHash("sha256").update(token).digest("hex");
    this.resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000);
    return token;
}

module.exports = mongoose.model('User', User);
