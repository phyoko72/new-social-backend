const {
    updateUserData,
    deleteUser,
    getSingleUser,
    follow,
    unFollow,
} = require("../controllers/user_controller")

const user_route = require("express").Router()

user_route.get("/:id", getSingleUser)

user_route.put("/:id/follow", follow)

user_route.put("/:id/unfollow", unFollow)

user_route.put("/:id", updateUserData)

user_route.delete("/:id", deleteUser)

module.exports = user_route
