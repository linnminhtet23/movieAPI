const{body }= require("express-validator");

const signUpSchema = [
    body("name").exists({checkFalsy: true}).withMessage("Please Fill Your Name"),
    body("email").isEmail().withMessage("Please Fill Your Email"),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 character"),
    body("confirmPassword").custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error("Password should be match");
        }
        return true;
    }),
    body("age").isNumeric().withMessage("Please fill your age"),

]

module.exports = signUpSchema;