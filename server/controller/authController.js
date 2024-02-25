const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const LoginTime = require('../models/loginTimeModel');
const errorHandler = require('../utils/errorHandler');
const respons = require('../utils/helper');
const { compare } = require('bcrypt');

// LOGIN USER
async function login(req, res, next){
    try {
        const { username, password } = req.body;
        if(!username) throw new errorHandler(400, 'Please input username!')
        if(!password) throw new errorHandler(400, 'Please input password!');

        const findUser = await User.findOne({ username: username });
        if(!findUser) throw new errorHandler(404, "User not found!");

        const matchPassword = await compare(password, findUser.password);
        if(!matchPassword) throw new errorHandler(403, "Wrong password");

        const token = jwt.sign({
            user_id: findUser._id,
            username: findUser.username,
            loginTime: new Date()
        }, process.env.JWT_SECRET
        );

        const historyLogin = new LoginTime({
            userId: findUser._id,
            token: token
        });

        await historyLogin.save();
        if(!historyLogin) throw new errorHandler(400, "Login error")
        res.status(200).json(respons.successWithData('Login success', {
            user_id: findUser._id,
            username: findUser.username,
            token: token,
            loginTime_id: historyLogin._id,
            loginTime: new Date()
        }));
    } catch (error) {
        next(error)
    }
};

// LOGOUT USER
async function logout(req, res, next){
    try {
        const { loginTime_id } = req.params

        const findHistory = await LoginTime.findById(loginTime_id);
        if(!findHistory) throw new errorHandler(400, "Error logout");

        const updateHistory = await LoginTime.findByIdAndUpdate( findHistory._id, { logoutTime: new Date() });
        if(!updateHistory) throw new errorHandler(400, "Error logout");

        res.status(200).json("Logout Success")
    } catch (error) {
        next(error)
    }
}

module.exports = {
    login,
    logout
}