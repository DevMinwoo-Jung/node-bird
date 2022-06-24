const express = require('express');
const cors = require('cors')
const postRouter = require('./route/post');
const userRouter = require('./route/user');
const db = require('./models')
const app = express();
const passportConfig = require('./passport');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')

// 이건 서버!
db.sequelize.sync()
    .then(() => {
        console.log('db connect success!!!')
    })
    .catch((error) => {
        console.error(error)
    })

passportConfig();
dotenv.config();
// 프론트에서 보낸 데이터를 req body에 넣어주는 역할
// 위치는 반드시 router보다 위에 있어야한다. 순차적으로 실행되기 때문에
// origin을 true로 해두면 보낸 곳의 주소가 자동으로 들어가 편리함
app.use(cors({
    origin: true,
    credentials: 'false'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('hello express!')
})

app.use('/post', postRouter)
app.use('/user', userRouter)



app.listen(3065, () => {
    console.log('servr running')
})