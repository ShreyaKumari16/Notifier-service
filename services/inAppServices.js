const notificationModel = require("../models/Notification");

const storeInApp = async (notificationId) => {
    await notificationModel.findByIdAndUpdate(notificationId, {
        status: "sent"
    });

    console.log("In-App notification marked sent");
}

module.exports = storeInApp;