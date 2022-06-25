const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('passport');

const { User, Post } = require('../models');
const db = require('../models');

router.post('/', async (req, res) => { // Post /user
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
router.post('/login', (req, res, next) => {
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
                return next(loginErr);
            }
            // res.setHeader('Cookie', 'miawdno');
            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
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
        })
    })(req, res, next)
});

router.post('/user/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.send('logout ok');
})

module.exports = router;