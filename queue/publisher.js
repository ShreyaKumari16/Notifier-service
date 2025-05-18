const amqp = require("amqplib");

let channel;

const connectQueue = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue("notifications");
        console.log("Connected to RabbitMQ and asserted queue");
    } catch(error) {
        console.error("RabbitMQ connection error:", error);
    }
}

const publishToQueue = async (queueName, notification) => {
    if (!channel) {
        console.error("RabitMQ channel not initialized");
        return ;
    }

    const bufferData = Buffer.from(JSON.stringify(notification));
    channel.sendToQueue(queueName, bufferData, {
        persistent: true
    });
}

module.exports = {
    connectQueue,
    publishToQueue
}