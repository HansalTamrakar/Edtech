const mongoose = require('mongoose')

const TagSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
      
        ref: "Course",
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model("Tag", TagSchema)