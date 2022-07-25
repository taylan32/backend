const mongoose = require("mongoose");

const connectToDB = () => {
  mongoose.connect(process.env.MONGO_URL)
  .then((result) => {
    console.log("Database connection succeed")
  })
  .catch(error => {
    console.log(error)
  }) 
}

module.exports = {connectToDB}