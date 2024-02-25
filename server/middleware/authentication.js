require('dotenv').config();
const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')

const verifyToken = (req, res, next) => {
  try {
    let tokenHeader = req.headers['authorization']
    if (!tokenHeader) {
      throw new errorHandler(401, "No Token Provided")
    } else { 
      let token = tokenHeader.split(' ')[1]
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {      
          throw new errorHandler(401, error.message)
        } else {  
          console.log(decoded)
          req.user = decoded
          next()
        }
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
};

module.exports = verifyToken;