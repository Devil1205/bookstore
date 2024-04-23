const User = require("../models/userSchema");
const { sendMail } = require("../utils/sendMail");
const { storeToken } = require("../utils/storeJwtToken");
const crypto = require('crypto');

//register user controller
exports.registerUser = async (req, res, next) => {
    try {
        //create user account using credentials and generate jwt token for login
        const { name, email, phone, password } = req.body;

        //if email id is already registered
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        user = new User({
            name,
            email,
            password,
            createdAt: Date.now()
        });

        //if phone number exists, add it to db
        if (phone)
            user.phone = phone;

        await user.save();
        storeToken(user, "Registration successful", res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//login user controller
exports.loginUser = async (req, res, next) => {
    try {
        //check for valid credentials and provide jwt token to user for login
        const { email, phone, password } = req.body;

        let user;
        if (email)
            user = await User.findOne({ email }).select("+password");
        else
            user = await User.findOne({ phone }).select("+password");

        if (!user || !await user.matchPassword(password)) {
            return res.status(409).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        storeToken(user, "Login successful", res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//get user profile controller
exports.getProfile = async (req, res, next) => {

    const user = req.user;
    return res.status(200).json({
        success: true,
        user
    });
}

//update user profile controller
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email, phone, image } = req.body;

        let user = req.user;

        user.name = name;
        user.email = email;
        user.image = image;
        //if phone number exists, add it to db
        if (phone)
            user.phone = phone;

        //update user credentials in db
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile updated"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//update user password controller
exports.updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, password } = req.body;

        let user = await User.findById(req.user._id).select("+password");

        //if old password is not matched
        if (! await user.matchPassword(oldPassword)) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }
        //update user password in db
        user.password = password;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//forgot password controller
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }
        //if email is not found
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        try {
            //generate reset token and mail the link using nodemailer to user email id
            const token = await user.generateResetToken();
            const resetPasswordUrl = `http://localhost:5000/api/v1/password/reset/${token}`;
            const message = `Your password reset link is : \n\n ${resetPasswordUrl} \n\nImportant: This link is only valid for 15 minutes, do not share it with anyone otherwise your account security may be compromised.`;
            const subject = "bookstore password reset";
            await user.save();
            sendMail(email, subject, message, res);
        }
        catch (error) {
            //if any error occur then remove the generated reset link from db for security
            user.resetToken = undefined;
            user.resetTokenExpire = undefined;
            await user.save();
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//reset password controller
exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        //create hash to reset token and match with reset token stored in db
        const resetToken = crypto.createHash("sha256").update(token).digest("hex");
        //if token is not expired and is valid
        const user = await User.findOne({ resetToken, resetTokenExpire: { $gt: Date.now() } }).select("+password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "The reset link is invalid or has been expired"
            });
        }

        //if password is reset then remove reset token from db
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();
        storeToken(user, "Password reset successful", res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

//logout user controller
exports.logoutUser = async (req, res, next) => {
    try {
        //remove token from cookie to logout
        return res.status(200).cookie("token", undefined).json({
            success: true,
            message: "Logout successful"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


