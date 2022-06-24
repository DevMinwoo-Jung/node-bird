const express = require('express');
const { User } = require('../models')
const bcrypt = require('bcrypt')
const router = express.Router();

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

module.exports = router;