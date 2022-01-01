const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema(
    {
        name:{
            type:String,
            required: true
        },        
        email:{
            type: String,
            required: true,
        },
        
        password:{
            type:String,
            required: true,
        },
        age:{
            type:Number,
            required:true
        },
        isAdmin:{
            type: Boolean,
            default:false,
            required: true
        },
        profile:{
            type:String,
            default:"",
            require: true
        },
        tokens:[{
            token:{
                type:String,
                required: true
            }
        }]
    },{
        timestamps:true
    }
)

const User = mongoose.model("User", userSchema);

module.exports = User;