const mongoose = require("mongoose");

const loginTimeSchema = mongoose.Schema({
    userId: String,
    token: String,
    loginTime: {
        type: Date,
        default: null
    },
    logoutTime: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const LoginTime = mongoose.model('LoginTime', loginTimeSchema);

module.exports = LoginTime;