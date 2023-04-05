const mongoose = require("mongoose")

const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        pages: {
            type: Number,
            required: true,
        },
    },
    {timestamps: true}
)

const BlogModel = mongoose.model("Blog", BlogSchema)
module.exports = BlogModel
