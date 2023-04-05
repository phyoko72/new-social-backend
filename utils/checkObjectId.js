const {isValidObjectId} = require("mongoose")

const checkObjectId = (id) => isValidObjectId(id)

module.exports = checkObjectId
