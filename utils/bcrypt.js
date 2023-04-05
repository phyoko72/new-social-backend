const bcrypt = require("bcrypt")

const hashing = async (data) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data, salt)
        return hashedPassword
    } catch (error) {
        console.log("Hashing Err: ", error)
        throw new Error(error.message)
    }
}

const comparing = async (data, db) => {
    try {
        const hashedPassword = await bcrypt.compare(data, db)
        return hashedPassword
    } catch (error) {
        console.log("Compare Err: ", error)
        throw new Error(error.message)
    }
}

module.exports = {hashing, comparing}
