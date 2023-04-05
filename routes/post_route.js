const {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    reactPost,
    getTimelinePosts,
    getSinglePost,
} = require("../controllers/post_controller")

const post_route = require("express").Router()

post_route.get("/", getAllPosts)

post_route.get("/:postId", getSinglePost)

post_route.get("/timeline", getTimelinePosts)

post_route.post("/create-post", createPost)

post_route.put("/:postId", updatePost)

post_route.put("/:postId/like", reactPost)

post_route.delete("/:postId", deletePost)

module.exports = post_route
