const mongoose = require("mongoose");
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
            $type: mongoose.Schema.Type.ObjectId,
            ref: "Users"
        },
        tags: {
            type: Array,
            required: fasle
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