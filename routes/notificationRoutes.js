const express = require("express");
const router = express.Router();
const { z } = require("zod");
const { sendNotification, getUserNotifications } = require("../controllers/notificationController");
const userModel = require("../models/user");

// /api POST & GET
router.post('/signup', async function(req, res) {
    const signUpBody = z.object({
        name: z.string(),
        email: z.string()
            .email({ message: "Invalid email format" }),
        phone: z.string()
            .min(10, { message: "Must be a valid phone number" })
            .max(14, { message: "Must be a valid phone number" })
    });

    const parsedData = signUpBody.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Invalid format",
            error: parsedData.error
        });
    }

    const { name, email, phone } = parsedData.data;

    try {
        const user = await userModel.create({ name, email, phone });

        res.status(201).json({
            message: "Signup succeded",
            user: user
        });
    } catch(error) {
        console.error("Sign up failed: ", error.message);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});
router.post('/notifications', sendNotification);
router.get('/users/:id/notifications', getUserNotifications);

module.exports = router;