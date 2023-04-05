const UserModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const {comparing, hashing} = require("../utils/bcrypt")
const checkObjectId = require("../utils/checkObjectId")

const getSingleUser = async (req, res) => {
    if (!req.params.id || !checkObjectId(req.params.id)) {
        return res.status(400).json({message: "Invalid userId"})
    }

    try {
        const foundUser = await UserModel.findById(req.params.id, {
            password: 0,
            createdAt: 0,
        })
        console.log("foundUser: ", foundUser)
        if (!foundUser) {
            return res.status(400).json({message: "No user found"})
        }
        return res.status(200).json(foundUser)
    } catch (err) {
        console.log("getSingleUser Err: ", err)
        return res.status(500).json("Internal Server Error")
    }
}

const follow = async (req, res) => {
    if (!req.params.id || !checkObjectId(req.params.id)) {
        return res.status(400).json({message: "Invalid userId"})
    }

    if (req.body.userId === req.params.id) {
        return res.status(400).json({message: "You cannot follow yourself"})
    }

    try {
        const searchUser = await UserModel.findById(req.params.id)
        const currentUser = await UserModel.findById(req.body.userId)
        console.log("searchuser: ", searchUser)

        if (!searchUser || !currentUser) {
            return res.status(400).json({message: "No user found"})
        }

        if (searchUser.followers.includes(req.body.userId)) {
            return res
                .status(403)
                .json({message: "You've already followed this user"})
        }

        await searchUser.updateOne({$push: {followers: req.body.userId}})
        await currentUser.updateOne({$push: {followings: req.params.id}})

        return res
            .status(200)
            .json({success: true, message: "Followed this user"})
    } catch (err) {
        console.log("getSingleUser Err: ", err)
        return res.status(500).json("Internal Server Error")
    }
}

const unFollow = async (req, res) => {
    if (!req.params.id || !checkObjectId(req.params.id)) {
        return res.status(400).json({message: "Invalid userId"})
    }

    if (req.body.userId === req.params.id) {
        return res.status(400).json({message: "You cannot unfollow yourself"})
    }

    try {
        const searchUser = await UserModel.findById(req.params.id)
        const currentUser = await UserModel.findById(req.body.userId)
        console.log("searchuser: ", searchUser)

        if (!searchUser || !currentUser) {
            return res.status(400).json({message: "No user found"})
        }

        if (!searchUser.followers.includes(req.body.userId)) {
            return res
                .status(403)
                .json({message: "You've already unfollowed this user"})
        }

        await searchUser.updateOne({$pull: {followers: req.body.userId}})
        await currentUser.updateOne({$pull: {followings: req.params.id}})

        return res
            .status(200)
            .json({success: true, message: "Successfully Unfollowed this user"})
    } catch (err) {
        console.log("getSingleUser Err: ", err)
        return res.status(500).json("Internal Server Error")
    }
}

const updateUserData = async (req, res) => {
    console.log("Req.body: ", req.params)

    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            try {
                req.body.password = await hashing(req.body.password)
            } catch (err) {
                return res.status(500).json(err.message)
            }
        }
        try {
            const result = await UserModel.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            })
            res.status(200).json("Account has been updated")
        } catch (err) {
            console.log("Err: ", err)
            return res.status(500).json(err.message)
        }
    } else {
        return res.status(403).json("You can update only yours")
    }
}

const deleteUser = async (req, res) => {
    if (!checkObjectId(req.params.id)) {
        return res.status(400).json({message: "Invalid userId"})
    }
    console.log("Req.id: ", req.params.id)
    // return res.end()
    if (req.body.userId === req.params.id) {
        try {
            const deleteUser = await UserModel.findByIdAndDelete(req.params.id)
            console.log("deleteUser: ", deleteUser)
            if (!deleteUser) {
                return res.status(401).json({
                    success: false,
                    message: "No user found and deleted",
                })
            }
            return res.status(200).json({
                success: true,
                message: deleteUser,
            })
        } catch (err) {
            console.log("Delete err: ", err)
            return res
                .status(500)
                .json({success: false, message: "Internal server error"})
        }
    } else {
        return res
            .status(403)
            .json({success: false, message: "You cannot delete other users."})
    }
}

module.exports = {getSingleUser, follow, unFollow, updateUserData, deleteUser}
