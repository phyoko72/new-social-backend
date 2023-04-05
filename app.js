const express = require("express")
const app = express()
const mongoose = require("mongoose")
const BlogModel = require("./models/BlogModel")
const auth_route = require("./routes/auth_route")
const post_route = require("./routes/post_route")
const user_route = require("./routes/user_route")

mongoose
    .connect("mongodb://127.0.0.1:27017/social")
    .then((aa) => {
        console.log("Db Connected: ")
        app.listen(8800, () => {
            console.log("Server is connected")
        })
    })
    .catch((err) => {
        console.log("Db err: ", err)
    })
app.use(express.json())

app.use("/api/users", user_route)
app.use("/api/auth", auth_route)
app.use("/api/posts", post_route)

app.use((req, res) => {
    res.status(404).json({success: false, message: "No route found"})
})

app.get("/", async (req, res) => {
    console.log("method ", req.method)
    try {
        const data = await BlogModel.find({}, {author: 1}).sort({author: 1})
        res.status(200).json(data)
    } catch (err) {
        console.log("Err: ", err)
        res.json(err.message)
    }
})

app.post("/create-blog", async (req, res) => {
    console.log(req.body)
    try {
        const result = await BlogModel.create(req.body)
        res.status(201).json(result)
    } catch (err) {
        console.log("Err: ", err)
        res.json(err.message)
    }
})
