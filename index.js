const express = require('express')
const dotenv = require('dotenv')
const routers = require('./routers/index')
const connectDB = require('./helpers/database/connectToDb')
const customErrorHandler=require("./middlewares/errors/customErrorHandler")
const path=require("path")
const cors = require('cors')

dotenv.config({
  path:'./config/env/config.env'
})

const app = express()
app.use(cors({origin:"*", methods:"*"}));
app.use(express.json());

const PORT = process.env.PORT
app.use("/api", routers)

app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))

app.use(customErrorHandler.customErrorHandler)

// DB Connection
connectDB.connectToDB()

app.use(express.static(path.join(__dirname, "public")))
global.__basedir = __dirname



app.listen(PORT,()=>{
  console.log(`app started on ${PORT} : ${process.env.NODE_ENV}`);
})

