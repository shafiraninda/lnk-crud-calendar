const express = require("express");
const ROUTER = express.Router();
const verifyToken = require("../middleware/authentication");
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const sendEmailController = require('../controller/sendEmailController')

ROUTER.post("/user/create", userController.createUser);
ROUTER.post("/login", authController.login);
ROUTER.post("/logout/:loginTime_id", verifyToken, authController.logout)
ROUTER.post("/send-email/create", verifyToken, sendEmailController.createSendEmail)
ROUTER.put("/send-email/edit/:id", verifyToken, sendEmailController.editSendEmail)
ROUTER.delete("/send-email/delete/:id", verifyToken, sendEmailController.deleteSendEmail)
ROUTER.get("/send-email/get/:id", verifyToken, sendEmailController.getSendEmailById)
ROUTER.get("/send-email/all", verifyToken, sendEmailController.getAllSendEmail)

ROUTER.all("*", (req, res, next) => {
    res.status(404).json({
        error: 404,
        message: `Request URL ${req.path} Not Found`
    });
});

ROUTER.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	res.status(statusCode).json({
		error: statusCode,
		message: err.message,
	});
});

module.exports = ROUTER;