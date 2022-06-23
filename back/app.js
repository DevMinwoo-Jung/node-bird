const express = require('express');
const postRouter = require('./route/post')
const db = require('./models')
const app = express();
db.sequelize.sync()
    .then(() => {
        console.log('db connect success!!!')
    })
    .catch((error) => {
        console.error(error)
    })


app.get('/', (req, res) => {
    res.send('hello express!')
})

app.use('/post', postRouter)

app.get('/api', (req, res) => {
    res.json([
        {
            id: 1, content: 'hello'
        },
        {
            id: 2, content: 'hello2'
        },
        {
            id: 3, content: 'hello3'
        }
    ])
})



app.listen(3065, () => {
    console.log('servr running')
})