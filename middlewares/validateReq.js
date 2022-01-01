const {validationResult} = require("express-validator");

const fs = require("fs");

const validateReq = (req, res, next)=>{
    // Finds the validation errors in this request 
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        // if we got error this will help not to sever
        if(req.file){
            fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({errors: errors.array()})
    }
next();
}


module.exports= validateReq;