const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 파일 시스템

const { Post, User, Image, Comment, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

try {
    fs.accessSync('uploads');
} catch (error) {
    console.log('upload 없어서 생성');
    fs.mkdirSync('uploads');
}

// form 마다 다를 수 있어서 따로 해줘야한다
const uploads = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) { // 중복 방지
            const ext = path.extname(file.originalname); // 확장자 추줄
            const basename = path.basename(file.originalname, ext)  // 이름 주출
            done(null, basename + '_' + new Date().getTime() + ext); // 민우 213213.png
        }
    }),
    limits: { fileSize: 20 * 1024 * 1024 } // 20mb
})// array인 이유가 여러 장 일수도 있어서, text는 none, 한장이면 single

router.post('/', isLoggedIn, uploads.none(), async (req, res, next) => { // post /post
    try {
        const hashtags = req.body.content.match(/(#[^\s#]+)/g);
        const post = await Post.create({ 
            content: req.body.content,
            UserId: req.user.id,
        });
        if (hashtags) {
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
                where: { name: tag.slice(1).toLowerCase() }, 
            }))) // [#노드, true], [#리액트, true] 이런식으로 나옴
            await post.addHashtags(result.map((y) => y[0]))
        } // 있으면 가져오고 없으면 등록 
        if (req.body.image) {
            if (Array.isArray(req.body.image)) { // 이미지 여러 개 올리면 image: [1.png, 2.png....]
                const images = await Promise.all(req.body.image.map((image) => { // db에는 파일 주소만 올리지 파일 자체를 올리는게 아니다!
                    Image.create({ src: image })}));
                await post.addImages(images);
            } else { // 하나면 1.png 이런식으로 
                const image = await Image.create({ src: req.body.image })
                await post.addImages(image);
            }
        } 
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

router.post('/images', isLoggedIn, uploads.array('image'), async (req, res, next) => { // post /images
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
})

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => { // post /post/retweet
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{
            model: Post,
            as: 'Retweet',
            }],
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where: {
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            },
        });
        if (exPost) {
            return res.status(403).send('이미 리트윗했습니다.');
        }
        const retweet = await Post.create({
            RetweetId: retweetTargetId,
            content: 'retweet',
            UserId: req.user.id,
        });
        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [{
            model: Post,
            as: 'Retweet',
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }]
        }, {
            model: User,
            attributes: ['id', 'nickname'],
        }, {
            model: Image,
        }, {
            model: Comment,
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }],
        }],
        })
        res.status(201).json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    } 
})

router.get('/:postId', async (req, res, next) => { // get /post/1
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{
            model: Post,
            as: 'Retweet',
            }],
        });
        if (!post) {
            return res.status(404).send('존재하지 않는 게시글입니다.');
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
            model: Post,
            as: 'Retweet',
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }]
        }, {
            model: User,
            attributes: ['id', 'nickname'],
        },{
            model: User,
            as: "Likers",
            attributes: ['id', 'nickname'],
        }, {
            model: Image,
        }, {
            model: Comment,
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }],
        }],
        })
        res.status(200).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    } 
})

module.exports = router;