const jwt = require("jsonwebtoken")
require("dotenv").config()

const User = require("../Models/User")

//auth
exports.auth = async(req,res,next)=>{
    try{
        //extract token
        const token = req.cookies.token || 
        req.body.token ||
        req.header("Authorisation").replace("Bearer","");

        //if token is missing then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        }
        try{
            const decode =  jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode)
            req.user= decode;
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Token is Invalid"
            })
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went while validating the token"
        })
    }
}

//isStudent
exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountTypes!=="Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for student only "
            })
        }

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User Role cannot be verified"
        })

    }
}
exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountTypes!=="Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only "
            })
        }

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User Role cannot be verified"
        })

    }
}
exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountTypes!=="Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for student only "
            })
        }

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User Role cannot be verified"
        })

    }
}