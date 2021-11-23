const express = require('express')
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const router = express.Router()
const requiredLogin = require('../middleware/requireLogin')

router.get('/allPosts', requiredLogin, async (req, res) => {
    try {
        const allPost = await Post.find()
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name")
        return res.json({ posts: allPost })
    } catch (err) {
        return res.json({ error: err })
    }
})

router.get('/getUserPosts', requiredLogin, async (req, res) => {
    try {
        const userPosts = await Post.find({
            postedBy: {
                $in: req.user.following
            }
        })
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name")
        return res.json({ posts: userPosts })
    } catch (err) {
        return res.json({ error: err })
    }
})

router.post('/createPost', requiredLogin, async (req, res) => {
    try {
        const { title, caption, url } = req.body
        if (!title || !caption || !url) {
            return res.status(422).json({ error: "Please add all the fields" })
        }
        const currentUser = { ...req.user }
        delete currentUser.password
        const post = new Post({
            title, caption,
            photo: url,
            postedBy: currentUser
        })
        const result = await post.save()
        return res.json({ post: result })
    } catch (err) {
        console.log('err:', err)
        return res.json({ error: err })
    }
})

router.get('/myPosts', requiredLogin, async (req, res) => {
    const userPosts = await Post
        .find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")

    return res.json({ posts: userPosts })
})

router.put('/like', requiredLogin,  async (req, res) => {
    try {
        const { postId } = req.body
        if (!postId) {
            return res.status(422).json({ error: "Please add all the fields" })
        }
        const post = await Post.findByIdAndUpdate(postId, {
            $push: {
                likes: req.user._id
            }
        }, {
            new: true
        })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .exec()
        return res.json({ post: post })
    } catch (err) {
        console.log('err', err)
        return res.json({ error: err })
    } 
})

router.put('/unlike', requiredLogin,  async (req, res) => {
    try {
        const { postId } = req.body
        if (!postId) {
            return res.status(422).json({ error: "Please add all the fields" })
        }
        const post = await Post.findByIdAndUpdate(postId, {
            $pull: {
                likes: req.user._id
            }
        }, {
            new: true
        })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec()
        return res.json({ post: post })
    } catch (err) {
        console.log('err', err)
        return res.json({ error: err })
    } 
})

router.put('/comment', requiredLogin, async (req, res) => {
    try {
        const { postId, comment } = req.body
        if (!postId || !comment) {
            return res.status(422).json({ error: "Please add all the fields" })
        }
        const commentObj = {
            comment, postedBy: req.user._id
        }
        const post = await Post.findByIdAndUpdate(postId, {
            $push: {
                comments: commentObj
            }
        }, {
            new: true
        })
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name")
            .exec()
        return res.json({ post: post })
    } catch (err) {
        console.log('err', err)
        return res.json({ error: err })
    } 
})

router.delete('/deletePost/:postId', requiredLogin, async (req, res) => {
    try {
        const { postId } = req.params
        if (!postId) {
            return res.status(422).json({ error: "Please add all the fields" })
        }
        const post = await Post.findOne({ _id: postId}).populate("postedBy", "_id name").exec()
        if (!post) {
            return res.status(422).json({ error: 'Post not existing' })
        } else {
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                const removedPost = await post.remove()
                return res.json({ message: "Post deleted", removedPost })
            }
        }
    } catch (err) {
        console.log('err', err)
        return res.json({ error: err })
    } 
})

module.exports = router