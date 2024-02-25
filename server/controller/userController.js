const User = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const {hash} = require('bcrypt');
const respons = require('../utils/helper');

// CREATE USER
async function createUser(req, res, next){
    try {
        const { username, password } = req.body
        if( !username ) throw new errorHandler(400, "Please input username!")
        if( !password ) throw new errorHandler(400, "Please input password!")

        const hashPassword = await hash(password, 10)
        const newUser = new User({
            username: username,
            password: hashPassword
        });

        await newUser.save();

        if(newUser){
            return res.status(200).json(respons.successWithData('Success', newUser));
        }else{
            throw new errorHandler(400, "Failed to create user")
        }

    } catch (error) {
        next(error)
    }
};

module.exports = { createUser }