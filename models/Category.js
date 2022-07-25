const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    name:{
        type:String,
        required:[true, "Please provide a name"],
        minlength:[2, "Category name must contain 2 characters"]
    },
    products:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Product",
            select:false
        }
    ]
})

module.exports = mongoose.model("Category", CategorySchema)