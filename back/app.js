const express = require('express');
const postRouter = require('./route/post')

const app = express();

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