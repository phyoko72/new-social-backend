const UserModel = require("../models/UserModel")
const {comparing, hashing} = require("../utils/bcrypt")

const getUser = async (req, res) => {
    console.log("Req.path: ", req.path)
    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash("data", salt)
    // console.log("hashedPassword: ", hashedPassword)
    // const valid = await bcrypt.compare('data',.)
    const checking = await comparing(
        "data",
        "$2b$10$wiMINOSdru2CKZhoifzCNe0yTEKTTvtnmycMk6Xed9vWSSFMniQsu"
    )
    console.log("Checking: ", checking)
    res.end()
}

const createUser = async (req, res) => {
    console.log("Req.body: ", req.body)

    try {
        const hashedpassword = await hashing(req.body.password)
        const result = await UserModel.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedpassword,
        })
        console.log("Created User: ", result)
        res.status(201).json(result)
    } catch (err) {
        console.log("Err: ", err)
        res.status(400).json(err.message)
    }
}

const logInUser = async (req, res) => {
    console.log("Req.body: ", req.body)

    const {email, password} = req.body

    try {
        const foundUser = await UserModel.findOne({email})
        console.log("foundUser ", foundUser)
        if (!foundUser) {
            throw new Error("No user found")
        }
        const validation = await comparing(password, foundUser.password)
        if (!validation) {
            throw new Error("Wrong Password")
        }

        res.status(200).json({success: true, message: "OK"})
    } catch (err) {
        console.log("Err: ", err)
        res.status(400).json(err.message)
    }
}

module.exports = {createUser, logInUser}
