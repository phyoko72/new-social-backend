const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            requried: true,
        },

        desc: {
            type: String,
            max: 500,
            required: true,
        },
        image: {
            type: String,
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    {timestamps: true}
)

const PostModel = mongoose.model("Post", postSchema)

module.exports = PostModel
