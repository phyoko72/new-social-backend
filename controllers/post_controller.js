const PostModel = require("../models/PostModel")
const UserModel = require("../models/UserModel")
const checkObjectId = require("../utils/checkObjectId")
const checkRegistered = require("../utils/checkRegistered")

const getAllPosts = async (req, res) => {
    const {userId} = req.body

    // if (!userId) {
    //     return res.status(400).json({success: false, message: "Invalid Data"})
    // }

    // if (!checkObjectId(userId)) {
    //     return res.status(400).json({success: false, message: "Invalid userId"})
    // }

    try {
        // const isLoggedInUser = await UserModel.findById(userId)
        // console.log("isLoggedInUser: ", isLoggedInUser)
        // if (!isLoggedInUser) {
        //     return res
        //         .status(401)
        //         .json({success: false, message: "Unauthorized User"})
        // }
        // const result = await checkRegistered(userId)
        // console.log("result: ", result)
        // if (!result) {
        //     return res
        //         .status(401)
        //         .json({success: false, message: "Unauthorized User"})
        // }
        const getAllPosts = await PostModel.find()
        console.log("getAllPosts: ", getAllPosts)
        if (getAllPosts)
            return res.status(201).json({success: true, data: getAllPosts})
    } catch (err) {
        console.log("createPost err: ", err)
        return res
            .status(500)
            .json({success: false, message: "Internal Server Error"})
    }
}

const getSinglePost = async (req, res) => {
    const {postId} = req.params
    const {userId} = req.body

    if (!userId || !postId) {
        return res.status(400).json({success: false, message: "Invalid Data"})
    }

    if (!checkObjectId(userId) || !checkObjectId(postId)) {
        return res.status(400).json({success: false, message: "Invalid userId"})
    }

    try {
        // const isLoggedInUser = await UserModel.findById(userId)
        // console.log("isLoggedInUser: ", isLoggedInUser)
        // if (!isLoggedInUser) {
        //     return res
        //         .status(401)
        //         .json({success: false, message: "Unauthorized User"})
        // }
        const result = await checkRegistered(userId)
        console.log("result: ", result)
        if (!result) {
            return res
                .status(401)
                .json({success: false, message: "Unauthorized User"})
        }
        const getSinglePost = await PostModel.findById(postId)
        console.log("getSinglePost: ", getSinglePost)
        if (getSinglePost)
            return res.status(201).json({success: true, data: getSinglePost})
    } catch (err) {
        console.log("getSinglePost err: ", err)
        return res
            .status(500)
            .json({success: false, message: "Internal Server Error"})
    }
}

const getTimelinePosts = async (req, res) => {
    const {userId} = req.body

    if (!userId) {
        return res.status(400).json({success: false, message: "Invalid Data"})
    }

    if (!checkObjectId(userId)) {
        return res.status(400).json({success: false, message: "Invalid userId"})
    }

    try {
        const currentUser = await UserModel.findById(userId)
        console.log("currentUser: ", currentUser)
        if (!currentUser) {
            return res
                .status(401)
                .json({success: false, message: "Unauthorized User"})
        }

        const currentUserPosts = await PostModel.find({userId: userId})
        const follwingPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return PostModel.find({userId: friendId})
            })
        )

        const timelinePosts = currentUserPosts.concat(follwingPosts)

        console.log("currentUserPosts: ", currentUserPosts, "\n\n")
        console.log("follwingPosts: ", follwingPosts)

        if (follwingPosts)
            return res.status(201).json({
                success: true,
                data: currentUserPosts.concat(follwingPosts),
            })
    } catch (err) {
        console.log("createPost err: ", err)
        return res
            .status(500)
            .json({success: false, message: "Internal Server Error"})
    }
}

const createPost = async (req, res) => {
    console.log("Req.path: ", req.path)

    const {userId, desc} = req.body

    if (!userId || !desc) {
        return res.status(400).json({success: false, message: "Invalid Data"})
    }

    if (!checkObjectId(userId)) {
        return res.status(400).json({success: false, message: "Invalid userId"})
    }

    try {
        const isLoggedInUser = await UserModel.findById(userId)
        console.log("isLoggedInUser: ", isLoggedInUser)
        if (!isLoggedInUser) {
            return res
                .status(401)
                .json({success: false, message: "Unauthorized User"})
        }
        const createdPost = await PostModel.create({userId, desc})
        console.log("createdPost: ", createdPost)
        if (createdPost)
            return res
                .status(201)
                .json({success: true, message: "Post Created Successfully."})
    } catch (err) {
        console.log("createPost err: ", err)
        return res
            .status(500)
            .json({success: false, message: "Internal Server Error"})
    }
}

const updatePost = async (req, res) => {
    const {postId} = req.params
    const {userId, desc} = req.body

    if (!userId) {
        return res.status(400).json({success: false, message: "Invalid Data"})
    }

    if (!checkObjectId(userId)) {
        return res.status(400).json({success: false, message: "Invalid userId"})
    }

    try {
        const isLoggedInUser = await UserModel.findById(userId)
        console.log("isLoggedInUser: ", isLoggedInUser)
        if (!isLoggedInUser) {
            return res
                .status(401)
                .json({success: false, message: "Unauthorized User"})
        }

        const postToBeUpdated = await PostModel.findById(postId)

        if (postToBeUpdated.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can update only your post.",
            })
        }

        const updatedPost = await postToBeUpdated.updateOne({
            $set: req.body,
        })
        console.log("updatedPost: ", updatedPost)
        if (updatedPost)
            return res.status(201).json({
                success: true,
                message: "Post Created Successfully.",
                data: updatedPost,
            })
    } catch (err) {
        console.log("updatedPost err: ", err)
        return res
            .status(500)
            .json({success: false, message: "Internal Server Error"})
    }
}

const reactPost = async (req, res) => {
    const {postId} = req.params
    const {userId} = req.body

    if (!userId) {
        return res.status(400).json({success: false, message: "Invalid Data"})
    }

    if (!checkObjectId(userId) || !checkObjectId(postId)) {
        return res.status(400).json({success: false, message: "Invalid Id"})
    }

    try {
        const isLoggedInUser = await UserModel.findById(userId)
        console.log("isLoggedInUser: ", isLoggedInUser)
        if (!isLoggedInUser) {
            return res
                .status(401)
                .json({success: false, message: "Unauthorized User"})
        }

        const postToBeReact = await PostModel.findById(postId)

        if (!postToBeReact) {
            return res
                .status(400)
                .json({success: false, message: "No post found!"})
        }

        if (!postToBeReact.likes.includes(userId)) {
            const likedPost = await postToBeReact.updateOne({
                $push: {likes: userId},
            })
            console.log("likedPost: ", likedPost)
            if (likedPost)
                return res.status(201).json({
                    success: true,
                    message: "Post liked successfully.",
                    data: likedPost,
                })
        } else {
            const unlikedPost = await postToBeReact.updateOne({
                $pull: {likes: userId},
            })
            console.log("unlikedPost: ", unlikedPost)
            if (unlikedPost)
                return res.status(201).json({
                    success: true,
                    message: "Post unliked successfully.",
                    data: unlikedPost,
                })
        }
    } catch (err) {
        console.log("reactedPost err: ", err)
        return res
            .status(500)
            .json({success: false, message: "Internal Server Error"})
    }
}

const deletePost = async (req, res) => {
    const {postId} = req.params
    const {userId} = req.body

    if (!userId) {
        return res.status(400).json({success: false, message: "Invalid Data"})
    }

    if (!checkObjectId(userId)) {
        return res.status(400).json({success: false, message: "Invalid userId"})
    }

    try {
        const isLoggedInUser = await UserModel.findById(userId)
        console.log("isLoggedInUser: ", isLoggedInUser)
        if (!isLoggedInUser) {
            return res
                .status(401)
                .json({success: false, message: "Unauthorized User"})
        }

        const postToBeDeleted = await PostModel.findById(postId)

        if (postToBeDeleted.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can delete only your post.",
            })
        }

        const deletedPost = await postToBeDeleted.deleteOne()
        console.log("deletedPost: ", deletedPost)
        if (deletedPost)
            return res.status(201).json({
                success: true,
                message: "Post Deleted Successfully.",
                data: deletedPost,
            })
    } catch (err) {
        console.log("deletedPost err: ", err)
        return res
            .status(500)
            .json({success: false, message: "Internal Server Error"})
    }
}

module.exports = {
    getAllPosts,
    getSinglePost,
    getTimelinePosts,
    createPost,
    updatePost,
    reactPost,
    deletePost,
}
