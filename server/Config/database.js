const mongoose = require('mongoose')

const dbConnect = () =>{
    mongoose.connect("mongodb://127.0.0.1:27017/Edtech")
    .then(()=>{console.log("Edtech is Connected")})
    .catch((e)=>{console.log(e)})
}
module.exports = dbConnect;