const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
    {
        amount : {
            type : Number,
            required : true,
        },
        category : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Category",
            required : true,
        },
        period : {
            type : String,
            enum : ['daily','weekly','monthly', 'yearly']
        },
        start : {
            type : Date,
            default : Date.now()
        },
        endDate : {
            type : Date,
        },
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        createdAt : {
            type : Date,
            default : Date.now
        }
    }
)
module.exports = mongoose.model('Budget',BudgetSchema);