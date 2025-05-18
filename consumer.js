require("dotenv").config();
const { connectDB } = require("./config/db");
const consumeQueue = require("./queue/consumer");

(async () => {
    await connectDB();
    consumeQueue();
})();
