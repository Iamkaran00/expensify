const e = require('express');
const mongoose = require('mongoose');


const IncomeSchema = new mongoose.Schema(
    {icon : {
        type : String,
        required : true,
    },
   title : {
    type : String,
    required : true,
    trim : true,
    maxLength : 50

   },
    category : {
   type : mongoose.Schema.Types.ObjectId,
   ref : 'Category'
      },
      user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true,
      },
   
   amount : {
    type : Number,
    required : true,
    maxLength : 20,
    trim : true,
   },
   type : {
    type : String,
    default : "income"
   },
date : {
    type : Date,
    required : true,
    trim : true,
},
category : {
    type : String,
    required  : true,
    trim: true,

},
description : {
    type : String,
    trim : true,
    maxLength : 120
}
    },
    {
        timestamps : true,
    }
)
module.exports = mongoose.model('Income ',IncomeSchema)