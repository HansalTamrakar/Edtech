const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: email,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    accountTypes: {
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',

    }],
    images: {
        type: String,
        required: true
    },
    token: {
        type: String,

    },
    resetPasswordExpires: {
        type: Date()

    },
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseProgress'
    }],
})
module.exports = mongoose.model("User", UserSchema)