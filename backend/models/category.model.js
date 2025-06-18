const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
    },
    type : {
        type : String,
        enum : ['income','expense']
    },
    color : {
        type : String,
        default : '#0099ff',
    },
    icon : {
        type : String,
        
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});
module.exports = mongoose.model("Category",categorySchema)