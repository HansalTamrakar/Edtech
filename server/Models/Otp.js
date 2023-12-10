const mongoose = require('mongoose')

const OtpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    }
});


//a function to sends emails

async function sendVerificationEmails(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", otp)
        console.log("email send Succesfully", mailResponse)
    }
    catch (error) {
        console.log("error occured while Sending mail error", error)
        throw error;
    }
}

OtpSchema.pre("save", async function (next) {
    await sendVerificationEmails(this.email, this.otp)
    next()
})
module.exports = mongoose.model("Otp", OtpSchema)