//const cookies = require('cookie-parser');
const createError = require('http-errors');
const JWT = require("jsonwebtoken");

const routeAuth = (req, res, next) =>{
    const cookies = req.cookies;
    if(!cookies?.accessToken) throw createError.Unauthorized();
    const accessToken = cookies.accessToken;
    JWT.verify(accessToken, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') return next(createError.Unauthorized())
            else {
                return next(createError.Unauthorized(err.message))
            }
        }
        req.payload = payload;
        next()
    })
}
module.exports = {
    routeAuth
}