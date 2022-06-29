const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('passport');

const { User, Post, Comment, Image, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const db = require('../models');


router.get('/', async (req, res, next) => {
    console.log(req.headers)
    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: ['password'] // 비밀번호 제외하고 다 가져온다
                },
                include: [{ // 다른 테블의 정보를 가져올 때  쓴다 (join 같은 것 인듯)
                    model: Post, 
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, { 
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.get('/:userId', async (req, res, next) => { // get/user1
    try {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.params.userId },
                attributes: {
                    exclude: ['password'] // 비밀번호 제외하고 다 가져온다
                },
                include: [{ // 다른 테블의 정보를 가져올 때  쓴다 (join 같은 것 인듯)
                    model: Post, 
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, { 
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }]
            })
            if (fullUserWithoutPassword) {
                const data = fullUserWithoutPassword.toJSON();
                data.Posts = data.Posts.length; // 개인정보 침해 예방
                data.Followers = data.Followers.length;
                data.Followings = data.Followings.length;
                res.status(200).json(data);
            } else {
                res.status(404).json('존재하지 않는 아이디입니다.');
            }
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.post('/', isNotLoggedIn, async (req, res) => { // Post /user
    try {
    const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (exUser) {
            return res.status(403).send('이미 가입된 이메일 입니다.')
        }
        // 여기서 return 없으면 응답 2번!! 하나의 요청에는 하나의 응답!
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // 10 ~ 13을 넣어주는데 높을수록 보안이 쌔짐
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060');
        res.send('ok');
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// middleware 확장...?
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) { // server error
            console.error(error);
            return next(error);
        }
        if (info) { // client error
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            if (loginErr) { 
                console.error(loginErr);
                return next(loginErr); // next에 error가 있으면 다음 미들웨어로 가는게 아니라 바로 에러 처리로 간다
            }
            // res.setHeader('Cookie', 'miawdno');
            try {
                if (req.user) {
                    const fullUserWithoutPassword = await User.findOne({
                        where: { id: req.user.id },
                        attributes: {
                            exclude: ['password'] // 비밀번호 제외하고 다 가져온다
                        },
                        include: [{ // 다른 테블의 정보를 가져올 때  쓴다 (join 같은 것 인듯)
                            model: Post, 
                            attributes: ['id'],
                        }, {
                            model: User,
                            as: 'Followings',
                            attributes: ['id'],
                        }, { 
                            model: User,
                            as: 'Followers',
                            attributes: ['id'],
                        }]
                    })
                    return res.status(200).json(fullUserWithoutPassword); // 이제 프론트로 넘기기~
                } else {
                    return res.status(200).json(null); // 이제 프론트로 넘기기~
                }
            } catch (error) {
                console.log(error);
                next(error);
            }
        })
    })(req, res, next) 
});

router.post('/logout', isLoggedIn, (req, res) => {
    req.logout(() => {});
    req.session.destroy();
    res.send('logout ok');
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await User.update({
            nickanme: req.body.nickname,
        }, {
            where: { id: req.user.id }
        })
        res.status(200).json({ nickname: req.body.nickname });
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { // Patch/user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            res.status(403).send('cannot follow');
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error); 
    }
})

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => { // delete/user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            res.status(403).send('cannot unfollow');
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => { // delete/user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            res.status(403).send('cannot unfollow');
        }
        await user.removeFollowings(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.get('/followers', isLoggedIn, async (req, res, next) => { // get/ user/followers
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (!user) {
            res.status(403).send('cannot get followers');
        }
        const followers = await user.getFollowers({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit, 10),
        });
        res.status(200).json(followers);
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.get('/followings', isLoggedIn, async (req, res, next) => { // get/ user/followings
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        if (!user) {
            res.status(403).send('cannot get followings');
        }
        const followings = await user.getFollowings({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit, 10),
        });
        res.status(200).json(followings);
    } catch (error) {
        console.error(error);
        next(error);
    }
})

router.get('/:userId/posts', async (req, res, next) => { //get /user/1/posts
    try {
        const where = { id: req.params.userId };
        if (parseInt(req.query.lastId, 10)) { 
            where.id ={ [Op.lt ]: parseInt(req.query.lastId, 10)} 
        }
        const posts = await Post.findAll({ 
            where,
            limit: 10,
            order: [['createdAt', 'DESC'], [Comment, 'createdAt', 'DESC']], 
            include: [{
                model: User,
                attributes: ['id', 'nickname']
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname']
                }],
            }, {
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }],
        });
        res.status(200).json(posts)
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;