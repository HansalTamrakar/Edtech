const User = require('../Models/User')
const Otp = require('../Models/Otp')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
require('dotenv').config()
//send Otp
exports.sendOTP = async (req, res) => {
    try {
        //fetch email from request ki body
        const { email } = req.body;

        //check if user already exsisit

        const checkUserPresent = await User.findOne({ email })

        //if already exsist  then return a response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User Already Exsist",

            })
        }
        //generate OTp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        console.log("OTP GENERATED", otp)

        //check for unique Pin
        const result = await otp.findOne({ otp: otp })

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await otp.findOne({ otp: otp })
        }

        const otpPayload = { email, otp };
        //create an entry for Otp
        const otpBody = await Otp.create(otpPayload)
        console.log(otpBody)

        //return response succesful
        res.status(200).json({
            success: true,
            message: "otp sent succesfully",
            otp,
        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

//signup

exports.signUp = async (req, res) => {
    try {
        //data fetch from body
        const { firstName, lastName, email, password, accountTypes, confirmPassword, contactNumber, Otp } = req.body;
        //validate karlo
        if (!firstName || !lastName || !email || !password || !confirmPassword || !Otp) {
            return res.status(403).json({
                success: false,
                message: "All Fields are Required"
            })
        }
        //2 password match karlo
        if (password == !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirm pasword are not same"
            })
        }
        //check already user exsist or not
        const exsistingUser = await User.findOne({ email });
        if (exsistingUser) {
            return res.status(400).json({
                success: false,
                message: "User is Already Registered"
            })
        }

        //find most recent Otp stored in trhe user
        const recentOtp = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp)
        //validate Otp
        if (recentOtp.length == 0) {
            //Otp Not found
            return res.status(400).json({
                success: false,
                message: "Otp Not found"
            })
        } else if (Otp != recentOtp.otp) {
            //Otp is Incorrect 
            return res.status(400).json({
                success: false,
                message: "Otp is Incorrect "
            })

        }
        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        //entry creaate on Db
        const profileDetalils = await Profile.create({
            gender: null,
            dateOfBirth: null,
            contactNumber: null
        })
        const user = await User.create({
            firstName, lastName, contactNumber, email, password: hashedPassword, accountTypes, additionalDetails: profileDetalils._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })


        //return res
        return res.status(200).json({
            success: true,
            message: "User is Registered Succefully",
            user
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "User cannot Registered ",

        })

    }



}

//Login
exports.login = async () => {
    try {
        //get data from body
        const { email, password } = req.body;

        //validate Data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "Fill all the files"
            })
        }

        //user check exsist or not
        const user = await User.findOne({ email }).populate("additionalDetails")
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered plse signup first"
            })
        }    //generate JWT after password matching
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountTypes: user.accountTypes

            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            })
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in Succesfully"
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "password is Incorrect"
            })

        }

    }
    catch (err) {
        console.log(err)
        return res.status(401).json({
            success: false,
            message: "Try again Later"
        })

    }
}
//ChangePassword
exports.changePassword = async (req, res) => {
    //get data from req.body
    //get old new and confirm pass
    //validation
    //update password in db
    //send email
    //return response

}