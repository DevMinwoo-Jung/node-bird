const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 파일 시스템

const { Post, User, Image, Comment } = require('../models');
const { isLoggedIn } = require('./middlewares');

try {
    fs.accessSync('uploads');
} catch (error) {
    console.log('upload 없어서 생성');
    fs.mkdirSync('uploads');
}

router.post('/', isLoggedIn, async (req, res, next) => { // post /post
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

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => { // PATCH /pst/1/like
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        })
        if (!post) {
            return res.send(403).send('cannot like');
        }
        await post.addLikers(req.user.id); // 이거 시퀄라이즈에서 알아서 만들어 주는거;
        res.json({ PostId: post.id, UserId: req.user.id})
    } catch (error) {
        console.error(error);
        next(error)
    }

})

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => { // DELETE /post/1/like
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        })
        if (!post) {
            return res.send(403).send('cannot unlike');
        }
        await post.removeLikers(req.user.id); // 이거 시퀄라이즈에서 알아서 만들어 주는거;
        res.json({ PostId: post.id, UserId: req.user.id})
    } catch (error) {
        console.error(error);
        next(error)
    }
})

router.delete('/:postId', isLoggedIn, async (req, res, next) => { // DELETE /post/1/like
    try {
        await Post.destroy({
            where: { id: req.params.postId, userId: req.user.id }
        })
        res.json({ PostId: parseInt(req.params.postId, 10) })
    } catch (error) {
        console.error(error);
        next(error)
    }
})


// form 마다 다를 수 있어서 따로 해줘야한다
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'upload');
        },
        filename(req, file, done) { // 중복 방지
            const ext = path.extname(file.originalname); // 확장자 추줄
            const basename = path.basename(file.originalname, ext)  // 이름 주출
            done(null, basename + new Date().getTime() + ext); // 민우 213213.png
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 } // 20mb
})// array인 이유가 여러 장 일수도 있어서, text는 none, 한장이면 single
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => { // post /images
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
})

module.exports = router;