const express = require('express');
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
    host: REDIS_URL,
    port: REDIS_PORT,
    legacyMode: true
})

app.use(session({
    store: new redisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        httpOnly: true,
        saveUninitialized: false,
        maxAge: 30000,
    }
}));


redisClient.connect().catch(e => console.error(e));



redisClient.on('connect', () => console.log('Connected to Redis'))



dbConnectWithRetry();

app.use(express.json());
app.use(express.urlencoded({extended: false}));



app.get('/', (req, res) => {    
    console.log(req.body)

    res.send("hello world");
})

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)

app.listen(port, () => {
    console.log(`server is opened in ${port}`);
})