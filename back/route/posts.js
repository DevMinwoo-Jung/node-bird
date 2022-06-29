const express = require('express');
const { Post, User, Image, Comment } = require('../models')
const router = express.Router();
const { Op } = require('sequelize')

router.get('/', async (req, res, next) => {
    try {
        const where = {};
        if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때 여기 실행
            where.id ={ [Op.lt ]: parseInt(req.query.lastId, 10)} // 21 ~~~ 1 중 9, 8, 7.... 1 즉 lastId보다 작은 것만 가져와라 !
        }
        const posts = await Post.findAll({ // GET /posts
            where,
            limit: 10, // 10 개만 가져와
            // offset: 0, // 1 ~ 10번 게시글을 가져와
            order: [['createdAt', 'DESC'], [Comment, 'createdAt', 'DESC']], // 2차원 배열이 여러 기준으로 배열을 정리할수 있어서
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
            },
            {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }],
            // 이걸 실무에서는 안쓰는데 그 이유는 사람이 중간에 있는 게시물을 삭제한다면 문제가 생긴다
            // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.....
            // 10, 9, 8, 7 ...... ASC 기준
            // 20, 19..... 10, 10, 9, 8, 7.... 로딩을 하는 와중에 게시글이 하나 지워지면 다음 offset에서 하나를 뺴먹고 가져온다
            // 그래서 offset 말고 lastId 방식을 쓴다
            // where: { id: lastId },
            // 이건 db에서 제공하는게 아니라 구현해서 쓰는 것
            // lastId를 쓰면 좋은게 만약 lastId가 10일때 20 ~ 0이 있다고 가정하면 10이 지워져도 10보다 작은 숫자의 10개를 가져와서 문제가 없다
        });
        console.log(posts)
        res.status(200).json(posts)
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/:hashtag', async (req, res, next) => { //get /hashtag/
    try {
        const where = {};
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
                model: Hashtag,
                where: { name: req.params.hashtag }
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
            },
            {
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