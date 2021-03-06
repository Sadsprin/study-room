const express = require('express');
const cors = require('cors');
const redis = require('redis');
const session = require('express-session');

const dbConnectWithRetry = require('./config/dbconfig')
const postRouter = require('./routes/postRouter')
const userRouter = require('./routes/userRouter');
const { REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

const app = express();

const port = process.env.PORT || 3000

let redisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
    legacyMode: true,
    socket: {
        port: REDIS_PORT,
        host: REDIS_URL
    }
});
redisClient.on('error', err => {console.log('Error ' + err);});

redisClient.connect().catch(err => console.error(err))

app.use(session({
    store: new redisStore({client: redisClient}), 
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        httpOnly: true,
        saveUninitialized: false,
        maxAge: 3000000,
    }
}));

dbConnectWithRetry();

app.enable("trust proxy");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/api/v1', (req, res) => {
    res.send("hello world");
		console.log("yeah it ran",req.headers['x-real-ip']|| req.ips || req.socket.remoteAddress);
})

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)

app.listen(port, () => {
    console.log(`server is opened in ${port}`);
})
