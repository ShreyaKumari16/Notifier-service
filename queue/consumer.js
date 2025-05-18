const amqp = require("amqplib");
const notificationModel = require("../models/Notification");
const sendSMS = require("../services/smsServices");
const storeInApp = require("../services/inAppServices");
const sendEmail = require("../services/emailServices");
const userModel = require("../models/user");

const consumeQueue = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("notifications");

        console.log("Waiting for messages in queue...");

        channel.consume("notifications", async (msg) => {
            const data = JSON.parse(msg.content.toString());
            const { notificationId, userId, type, message } = data;
            const user = await userModel.findById(userId);

            if (!user)
                throw new Error('User not found');

            try {
                if (type === "sms") {
                    await sendSMS(user.phone, message);
                } else if (type === "email") {
                    await sendEmail(user.email, message);
                } else if (type === "in-app") {
                    await storeInApp(notificationId);
                }

                await notificationModel.findByIdAndUpdate(notificationId, {
                    status: "sent"
                });
                console.log(`Notification sent: ${notificationId}`);
                channel.ack(msg);
            } catch (error) {
                console.error("Error sending notification: ", error);
                const notification = await notificationModel.findById(notificationId);
                const currentRetries = notification.retryCount;

                if (currentRetries < 3) {
                    await notificationModel.findByIdAndUpdate(notificationId, {
                        status: "pending",
                        retryCount: currentRetries + 1
                    });

                    console.log(`Retrying notification ${notificationId} - Attempt ${currentRetries + 1}`);

                    setTimeout(() => {
                        channel.sendToQueue("notifications", Buffer.from(JSON.stringify(data)), {
                            persistent: true
                        });
                    }, 5000);
                } else {
                    await notificationModel.findByIdAndUpdate(notificationId, {
                        status: "failed",
                        retryCount: currentRetries
                    });
                    console.log(`Notification ${notificationId} permanently failed after 3 attempts.`)
                }

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Consumer error: ", error);
    }
}

module.exports = consumeQueue;