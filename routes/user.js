const express = require('express')
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const User = mongoose.model("User")
const router = express.Router()
const requiredLogin = require('../middleware/requireLogin')

router.get('/user/:id', requiredLogin, async (req, res) => {
    try {
        const { id } = req.params
        console.log('id', id)
        const user = await User.findOne({ _id: id }).select("-password")
        const posts = await Post.find({ postedBy: id })
            .populate("postedBy", "_id name")
            .exec()
        return res.json({ user, posts })
    } catch(err) {
        return res.json({ error: err })
    }
})

router.put('/follow', requiredLogin, async (req, res) => {
    try {
        const { followId } = req.body
        const followedUser = await User.findByIdAndUpdate(followId, {
            $push: {
                followers: req.user._id
            }
        }, { new: true }).select("-password")
        const currentUser = await User.findByIdAndUpdate(req.user._id, {
            $push: {
                following: followId
            }
        }, { new: true }).select("-password")
        return res.json({ followedUser, currentUser })
    } catch(err) {
        return res.json({ error: err })
    }
})

router.put('/unfollow', requiredLogin, async (req, res) => {
    try {
        const { followId } = req.body
        const unfollowedUser = await User.findByIdAndUpdate(followId, {
            $pull: {
                followers: req.user._id
            }
        }, { new: true }).select("-password")
        const currentUser = await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                following: followId
            }
        }, { new: true }).select("-password")
        return res.json({ unfollowedUser, currentUser })
    } catch(err) {
        return res.json({ error: err })
    }
})

router.put('/updatePic', requiredLogin, async (req, res) => {
    try {
        const { url } = req.body
        const currentUser = await User.findByIdAndUpdate(req.user._id, {
            $set: {
                url
            }
        }, { new: true }).select("-password")
        return res.json({ currentUser })
    } catch(err) {
        return res.json({ error: err })
    }
})

module.exports = router