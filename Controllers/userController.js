const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const otpGenerator = require('otp-generator');
const createError = require('http-errors');
const { User } = require('../Models/userModel');
const { Otp } = require('../Models/otpModel');
const {  signUpOtpSchema, signUpOtpVerifySchema, signInOtpSchema, signInOtpVerifySchema } = require('../helpers/joi_validator.js');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper');


const signUp = async (req, res, next) => {

    try {
        //body validation
        const validationResult = await signUpOtpSchema.validateAsync(req.body);
        console.log(validationResult);

        const user = await User.findOne({ number: validationResult.number });
        if (user) {
            throw createError.Conflict(`${validationResult.number} is already registered.`);
            //redirect to user sign-in route
        }
        const OTP = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        //Note: otp generator generates 6 digit 'string' values.

        const number = validationResult.number;
        console.log(OTP);
        const otp = new Otp({
            number: number,
            name: validationResult.name,
            place: validationResult.place,
            otp: OTP
        });
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);
        const result = await otp.save();
        console.log(result);
        return res.status(200).json({ message: "Otp sent successfully ", result });
        //remove result from response
    }
    catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
};
//Below for user registration verification.
const signUp_verifyOtp = async (req, res, next) => {
    try {
        let otpValidationResult = await signUpOtpVerifySchema.validateAsync(req.body);
        console.log(otpValidationResult);
        const otpHolder = await Otp.find({ number: otpValidationResult.number });
        if (otpHolder.length === 0) {
            return res.status(400).json({ message: 'OTP not generated' });
        }
        const rightOtpFind = otpHolder[otpHolder.length - 1];

        const validUser = await bcrypt.compare(otpValidationResult.otp, rightOtpFind.otp);

        if (rightOtpFind.number === otpValidationResult.number && validUser) {
            const user = new User(_.pick(otpValidationResult, ["number", "name", "place"]));
            const accessToken = await signAccessToken(user);
            const result = await user.save();
            const OTPDelete = await Otp.deleteMany({
                number: rightOtpFind.number
            });
            return res.status(200).json({
                message: "User Registration Successfull!",
                token: accessToken,
                data: result
            });
        } else {
            const error = new Error("Wrong OTP Entered");
            error.status = 400;
            next(error);
        }
    }
    catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }

};
//checking wether user exists or not.
//otp generation and sending otp to user's mobile number.
const signIn = async (req, res, next) => {
    try {
        const validationResult = await signInOtpSchema.validateAsync(req.body);
        const user = await User.findOne({ number: validationResult.number });
        if (user) {
            throw createError.NotFound('User does not exist, kindly register.');
        }

        const OTP = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        console.log(OTP);

        const otp = new Otp({
            number: validationResult.number,
            otp: OTP
        });
        const salt = await bcrypt.genSalt(10);
        otp.otp = await bcrypt.hash(otp.otp, salt);
        const result = await otp.save();
        console.log(result);
        return res.status(200).json({ message: "Otp sent successfully " });
    }
    catch (error) {
        if (error.isJoi === true) error.status = 422; //validation error
        next(error);
    }
};

//verifying otp and login.
const signIn_verifyOtp = async (req, res, next) => {
    try {
        const validationResult = await signInOtpVerifySchema.validateAsync(req.body);
        const otpHolder = await Otp.find({ number: validationResult.number });
        if (otpHolder.length === 0) {
            throw createError.NotFound('OTP not generated');
            //return res.status(400).send('Invalid OTP');
        }
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        const validUser = await bcrypt.compare(validationResult.otp, rightOtpFind.otp);

        if (rightOtpFind.number === validationResult.number && validUser) {

            // jwt_verify here
            let user = new User(_.pick(req.body, ["number"]));
            user = user.toString();
            const accessToken = await signAccessToken(user);
            const refreshToken = await signRefreshToken(user);
            //const result = await user.save(); //data for logged in user//change collection name
            const OTPDelete = await Otp.deleteMany({
                number: rightOtpFind.number
            });
            return res.status(200).json({
                message: "login Successfull!",
                accessToken,
                refreshToken,
                data: user
            });
        } else {
            return res.status(400).json({ message: "Your OTP is wrong!" })
        }
    }
    catch (error) {
        if (error.isJoi === true) error.status = 422; //validation error
        next(error);
    }

}

const refresh_token = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createError.BadRequest();
        const user = await verifyRefreshToken(refreshToken); //resolves user

        const accessToken = await signAccessToken(user);
        const refToken = await signRefreshToken(user);
        res.json({ accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
        next(error)
    }
}
const protectedRoute = async (req, res, next) => {
    res.status(200).json({ message: "This is protected route" });
}

module.exports = {
    signUp,
    signUp_verifyOtp,
    signIn,
    signIn_verifyOtp,
    protectedRoute,
    refresh_token
}