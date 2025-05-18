const { z } = require("zod");
const userModel = require("../models/user");
const notificationModel = require("../models/Notification");
const { publishToQueue } = require("../queue/publisher");

const sendNotification = async (req, res) => {
    const notificationBody = z.object({
        userId: z.string(),
        type: z.enum(["email", "sms", "in-app"], { message: "Incorrect message type" }),
        message: z.string()
    });

    const parsedData = notificationBody.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Invalid format",
            error: parsedData.error
        });
    }

    const { userId, type, message } = parsedData.data;

    try {
        const user = await userModel.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const notification = await notificationModel.create({ userId, type, message });

        await publishToQueue('notifications', {
            notificationId: notification._id,
            userId,
            type,
            message
        });

        res.status(201).json({
            message: "Notification queued: ", notification
        });
    } catch (error) {
        console.error("Send notification error: ", error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

const getUserNotifications = async (req, res) => {
    const userId = req.params.id;
    const type = req.query.type;
    
    try {
        const filter = { userId };

        if(type) {
            filter.type = type;
        }

        const notifications = await notificationModel.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Notification fetched successfully",
            notifications: notifications
        });
    } catch(error) {
        console.log("Fetch notification error: ", error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

module.exports = {
    sendNotification,
    getUserNotifications
}