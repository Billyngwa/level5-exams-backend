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
            require: false
        },
        shares: {
            type: Number,
            require: false
        },
        comments: {
            type: String,
            require: false
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