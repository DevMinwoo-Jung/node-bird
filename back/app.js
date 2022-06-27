const express = require('express');
const cors = require('cors');
const postRouter = require('./route/post');
const userRouter = require('./route/user');
const postsRouter = require('./route/posts');
const db = require('./models');
const passportConfig = require('./passport');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();
const app = express(); 
// 이건 서버!
db.sequelize.sync()
    .then(() => {
        console.log('db connect success!!!') 
    })
    .catch((error) => {
        console.error(error)
    })

passportConfig();
// 프론트에서 보낸 데이터를 req body에 넣어주는 역할
// 위치는 반드시 router보다 위에 있어야한다. 순차적으로 실행되기 때문에
// origin을 true로 해두면 보낸 곳의 주소가 자동으로 들어가 편리함
app.use(cors({
    origin: 'http://localhost:3060',
    credentials: true,
  }));
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,  
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
// app.use((err, req, res, next) => { // error 처리 middleware 여기 있는 것 전부 middleware

// })

app.listen(3065, () => {
    console.log('servr running')
});