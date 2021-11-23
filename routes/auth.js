const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()
const User = mongoose.model("User")
const { JWT_SECRET } = require('../config/keys')

router.get('/protected', requireLogin, (req, res) => {
    res.send("Hello User")
})

router.post('/signup', async (req, res) => {
    const { name, email, password, url } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    try {
        const savedUser = await User.findOne({ email })

        if (savedUser) {
            return res.status(422).json({ error: "User exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({
            email, name, password: hashedPassword, url
        })
        const newUser = await user.save()
        return res.json({ message: "User Sign up", user: newUser })
    } catch (err) {
        return res.status(422).json({ error: err })
    }
})


router.post('/signin', async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(422).json({ error: "Please provide email or password" })
        }
        const savedUser = await User.findOne({ email })
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid Email or Password" })
        }
        const isMatch = await bcrypt.compare(password, savedUser.password)
        if (!isMatch) {
            return res.status(422).json({ error: "Invalid Email or Password" })
        } else {
            const token = jwt.sign({ 
                _id: savedUser._id
            }, JWT_SECRET)
            const { _id, name, email, followers, following, url } = savedUser
            console.log(savedUser)
            return res.json({
                message: "Successful Sign In",
                token,
                user: {
                    _id, name, email, followers, following, url
                }
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(422).json({ error: err })
    }
})

module.exports = router