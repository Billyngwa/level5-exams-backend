const mongoose = require("mongoose");
// const Users = require("../models/user")
const schema = mongoose.Schema;

const article = new schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            $ref:"Users"
        },
        tags: {
            type: Array,
            required: false
        },
        likes: {
            type: Number,
            require: false,
            default:0
        },
        shares: {
            type: Number,
            require: false,
            default:0
        },
        comments: {
            type: [String],
            require: false,
            default:[]
        },
        status:{
            type:String,
            default:"disable"
        }
    },
    {
        timestamps:true
    }
);

const articleModel = mongoose.model("Articles",article);
module.exports = articleModel;