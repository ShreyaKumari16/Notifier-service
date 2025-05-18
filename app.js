require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const { connectDB } = require("./config/db");
const notificationRoutes = require("./routes/notificationRoutes");
const { connectQueue } = require("./queue/publisher");

const app = express();
app.use(express.json());

app.use('/api', notificationRoutes)

async function main() {
    await connectDB();
    await connectQueue();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

main();