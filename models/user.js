const mongoose = require('mongoose');
const schema = mongoose.Schema;
const User = new schema({
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role: {
        type: String,
        require: false,
        default: 'USER'
    },
    otp:{
        type:Number,
        require:false,
        default:0
    },
    otpExpire:{
        type:Number,
        require:false,
        default:0
    }
},
{
    timestamps:true
},
);
    const userModel = mongoose.model("Users",User);
module.exports = userModel;
