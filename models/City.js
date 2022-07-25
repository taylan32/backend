const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CitySchema = new Schema({
    name: {
        type:String,
        required:[true,"Please provide a city name"]
    },
    orders:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Order",
            select:false
        }
    ]
})

module.exports = mongoose.model("City", CitySchema)