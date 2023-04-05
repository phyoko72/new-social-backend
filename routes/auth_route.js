const {createUser, logInUser} = require("../controllers/auth_controller")

const auth_route = require("express").Router()

auth_route.post("/sign-up", createUser)

auth_route.post("/log-in", logInUser)

module.exports = auth_route
