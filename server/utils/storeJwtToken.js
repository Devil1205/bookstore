//store jwt token method

exports.storeToken = async (user, message, res) => {
    try {
        const token = await user.generateToken();
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
        };
        return res.status(200).cookie("token", token, cookieOptions).json({
            success: true,
            message,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}