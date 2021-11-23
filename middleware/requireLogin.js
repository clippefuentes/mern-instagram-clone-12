const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const User = mongoose.model("User")
const { JWT_SECRET } = require('../config/keys')

module.exports = async (req, res, next) => {
    const { authorization } = req.headers
    if(!authorization) {
        return res.status(401).json({
            error: "You must be logged in"
        })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).json({
                error: "Unauthorize user, Log in please"
            })
        }

        const { _id } = payload
        const userData = await User.findById(_id)
        req.user = userData
        next()
    })
}