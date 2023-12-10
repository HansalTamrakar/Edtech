const User = require("../Models/User");
const mailSender = require('../utils/mailsender')
const bcrypt = require('bcrypt')
//reset Password Token
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from request body
        const email = req.body.email;

        //check user for the email email validation
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.json({
                success: false,
                message: "Your email is not registered with us"
            })
        }
        //generate Token
        const token = crypto.randomUUID();

        //update User by adding expiration and adding token
        const updateDetails = await User.findOneAndUpdate({
            email: email

        }, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000
        }, { new: true })
        //create url
        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing url
        await mailSender(email,
            "Password Reset Link",
            `Password Reset Link :${url}`)
        //return response
        return res.json({
            success: true,
            message: "Email sent succesfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Email failed"
        })

    }


}

//reset Password

exports.resetPassword = async (req, res) => {
    try {
        //data fetch
        const { password, confirmPassword, token } = req.body;
        //validation
        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password not matching "
            })

        }
        //get user details via token
        const userDetails = await User.findOne({ token: token })
        //if no entry invalide token
        if (!userDetails) {
            return res.json({
                success: false,
                message: "token is invalid"
            })
        }
        //token time check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "token is expired Regenerate it"
            })
        }
        //hash pwd
        const hashedPassword = await bcrypt.hash(password, 10)
        //pass update
        await User.findOneAndUpdate({
            token: token
        }, { password: hashedPassword }, { new: true })
        //return response
        return res.status(200).json({
            success: true,
            message: "Reset Password Succesfully"
        })

    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "something went wrong whilw sending reset pwd req"
        })

    }
}