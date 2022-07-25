const { CustomError } = require("../../helpers/error/CustomError");

const customErrorHandler=((err,req,res,next)=>{

    let customError=err;

    if(err.name==="CastError"){
        customError=new CustomError("please Provide a valid id",400)
    }    
    if(err.name==="SyntaxError"){
        customError=new CustomError("unexpected Syntax",400);
    }
    if(err.name==="ValidationError"){
        customError=new CustomError(err.message,400)
    }
    if(err.code===11000){
        //dublicate Error
        customError=new CustomError("dublicate key found check your Input",400)
    }
    res.status(customError.status || 500).json({
        success:false,
        message:customError.message,
        status:customError.status
    })
    console.log(customError.message,customError.status);
})


module.exports={
    customErrorHandler
}