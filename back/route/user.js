const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('passport');

const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const db = require('../models');


router.get('/', async (req, res, next) => {
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
})

module.exports = router;