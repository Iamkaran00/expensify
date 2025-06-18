 const asyncHandler = require('../utils/asyncfunction');
 const errorHandler = require('../utils/error.stack');
const mongoose = require('mongoose');
 const db = async ()=>{
    await mongoose.connect(process.env.database_connection_url,{
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
 }
 module.exports = db;