const mongoose = require('mongoose');
const {MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER} = require('./config');

module.exports = async () => {
    const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/`
    try {
        await mongoose.connect(mongoUrl)
        console.log("mongo is successfully connected");
    } catch(err) {
        console.error(err);
        setTimeout(connectWithRetry, 5000);
    }
}