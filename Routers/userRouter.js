const router = require('express').Router();
const { verifyAccessToken } = require('../helpers/jwt_helper');
const { signUp, signUp_verifyOtp, signIn, signIn_verifyOtp, protectedRoute, refresh_token, signInOtpVerifySchema } = require('../Controllers/userController');

router.route('/signup').post(signUp);
router.route('/signUp/verify').post(signUp_verifyOtp);
router.route('/login').post(signIn);
router.route('/login/verify').post(signIn_verifyOtp);
router.route('/profile').get(verifyAccessToken, protectedRoute);
router.route('/refresh-token').post(refresh_token);

module.exports = router;