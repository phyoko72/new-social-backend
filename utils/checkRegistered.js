const UserModel = require("../models/UserModel")

const checkRegistered = async (userId) => {
    const isLoggedInUser = await UserModel.findById(userId)
    console.log("isLoggedInUser: ", isLoggedInUser)
    return isLoggedInUser
}

module.exports = checkRegistered
