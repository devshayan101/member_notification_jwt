// const JWT = require('jsonwebtoken');
// const createError = require('http-errors');

// //1. Check for accessToken in header/cookie

// const routeAuth = (req, res)=>{
//     const cookies = req.cookies;
        // const token = cookies.accessToken;
//     JWT.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
//         if (err) {
//             if (err.name === 'JsonWebTokenError') return next(createError.Unauthorized())
//             else {
//                 return next(createError.Unauthorized(err.message))
//             }
//         }
//         req.payload = payload;
//         next()
//     })
// //    return res.json('Auth-route --contributionScreen.ejs');
// }

// module.exports={
//     routeAuth,

// }
//***This is achieved by helpers/routeAuth */