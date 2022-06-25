const express = require('express');
const { Post, User } = require('../models');
const { isLoggedIn } = require('./middlewares')
const router = express.Router();

router.post('/', isLoggedIn, async (req, res) => { // post /post
    try {
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        const fullPost = await Post.findOne({ 
            where: { id: post.id }, 
            include: [{
                model: Image,
            }, {
                model: Comment, 
            }, {
                model: User,
            }]
        })
        res.status(201).json(post); // 프론트로 보내주기~
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.post('/:postId/comment', isLoggedIn, async (req, res) => { // post /post/comment //:postId동적으로 바뀜 이거 예전에 봤던거!
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        })
        if (!post) {
            return res.status(403).send('not exists post');
        }
        const comment = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
            PostId: req.params.postId,
        });
        res.status(201).json(comment); // 프론트로 보내주기~
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.delete('/', (req, res) => {
    res.send('hello API!')
})

module.exports = router;