const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName : {
        type :String,
        required :  true,
        trim : true,
    
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        match : /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    password : {
        type : String ,
        required : true,
        select : false
    },
   profilePhoto : {
    type : String,
    required : true,
   },
   createdAt : {
    type : Date,
    default : Date.now
   }
})
module.exports = mongoose.model("User",UserSchema);