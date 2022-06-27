const express = require('express');
const { Post, User, Image, Comment } = require('../models');
const { isLoggedIn } = require('./middlewares')
const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => { // post /post
    try {
        const post = await Post.create({ 
            content: req.body.content,
            UserId: req.user.id,
        }); 
        const fullPost = await Post.findOne({ 
            where: { id: post.id },   
            include: [
            {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User, // 댓글 작성자
                    attributes: ['id', 'nickname'],
                }],
            }, { 
                model: User, // 게시글 작성자
                attributes: ['id', 'nickname'],
            }, {
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }]
        })
        console.log(fullPost)
        res.status(201).json(fullPost); // 프론트로 보내주기~
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => { // post /post/comment //:postId동적으로 바뀜 이거 예전에 봤던거!
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });
        if (!post) {
            return res.status(403).send('not exists post');
        };
        const comment = await Comment.create({
            content: req.body.content,
            UserId: req.user.id,
            PostId: parseInt(req.params.postId, 10),
        }); 
        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }]
        })
        res.status(201).json(fullComment); // 프론트로 보내주기~
    } catch (error) {
        console.error(error);
        next(error);
    } 
})

router.delete('/', (req, res) => {
    res.send('hello API!')
})

module.exports = router;