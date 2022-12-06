const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const otpGenerator = require('otp-generator');
const createError = require('http-errors');
const { User } = require('../Models/userModel');
const { Otp } = require('../Models/otpModel');
const { signUpOtpSchema, signUpOtpVerifySchema, signInOtpSchema, signInOtpVerifySchema } = require('../helpers/joi_validator.js');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper');


const signUp = async (req, res, next) => {

    try {
        //body validation
        const validationResult = await signUpOtpSchema.validateAsync(req.body);

        console.log(validationResult);
        const number = `${validationResult.code}${validationResult.number}`;
        console.log('number:',number);
        const user = await User.findOne({ number: number });
        console.log("user:",user);

        if (user) {
            throw createError.Conflict(`${number} is already registered.`);
            //redirect to user sign-in route
        }

        const OTP = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        //Note: otp generator generates 6 digit 'string' values.

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
        console.log('otpValidationResult:', otpValidationResult);

        const number = `${otpValidationResult.code}${otpValidationResult.number}`;
        
        const validatedData = {
            number: number,
            name: otpValidationResult.name,
            place : otpValidationResult.place,
            otp: otpValidationResult.otp
        }

        const otpHolder = await Otp.find({ number: number });
        if (otpHolder.length === 0) {
            return res.status(400).json({ message: 'OTP not generated' });
        }
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        console.log('rightOtpFind:', rightOtpFind);
        const validUser = await bcrypt.compare(validatedData.otp, rightOtpFind.otp);
        console.log('validUser:', validUser);

        if (rightOtpFind.number == number && validUser) {
            let user = _.pick(validatedData, ["number", "name", "place"]);
            user = JSON.stringify(user);
            const accessToken = await signAccessToken(user);
            const refreshToken = await signRefreshToken(user);

            user = JSON.parse(user);
            user = new User(user);
            const result = await user.save();

            const OTPDelete = await Otp.deleteMany({
                number: rightOtpFind.number
            });

            //res.header('Authorization', 'Bearer '+ accessToken);    // set access-token in header
            // save refresh token in cookie with httpsOnly property.
            res.cookie('accessToken', accessToken, {httpOnly: true, sameSite: 'None', maxAge: 10*60*1000});
            res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24*60*60*1000});

            return res.status(200).json({
                message: "User Registration Successfull!",
                token: accessToken,
                refreshToken: refreshToken,
                user: result
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

//Make sure your middleware is ordered properly, and if you're using Postman 
// setting the "Content-Type" header to "application/json" might help.

//If testing the API using POSTMAN, ensure that 'Content-Length' header is active and set to <calculated when request is sent>.

const signIn = async (req, res, next) => {
    //check if user is already loggedin or not. 

    try {
        const validationResult = await signInOtpSchema.validateAsync(req.body);
        const number = `${validationResult.code}${validationResult.number}`;

        
        const user = await User.findOne({ number: number });
        console.log(user);
        if (user==null) { 
            throw createError.NotFound('User does not exist, kindly register.');
        }

        const OTP = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        console.log(OTP);

        const otp = new Otp({
            number: number,
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
        const number = `${validationResult.code}${validationResult.number}`;

        const otpHolder = await Otp.find({ number: number });
        if (otpHolder.length === 0) {
            throw createError.NotFound('OTP not generated');
            //return res.status(400).send('Invalid OTP');
        }
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        console.log("rightOtpFind:",rightOtpFind);
        const validUser = await bcrypt.compare(validationResult.otp, rightOtpFind.otp);

        if (rightOtpFind.number === number && validUser) {

            // jwt_verify here

            //fetch 'name' from 'number' from database
            const userData = await User.findOne({number: number});
            console.log('userData:', userData);
            let user = _.pick(userData, ['number', 'name', 'place']);
            user = JSON.stringify(user);
            //added name, number and place to access-token.
            //remove _id: key-value from access-token
            console.log('user:', user);
            


            const accessToken = await signAccessToken(user);
            const refreshToken = await signRefreshToken(user);
            //const result = await user.save(); //data for logged in user//change collection name
            const OTPDelete = await Otp.deleteMany({
                number: rightOtpFind.number
            });
            //res.header('Authorization', 'Bearer '+ accessToken);    // set access-token in header
            res.cookie('accessToken', accessToken, {httpOnly: true, sameSite: 'None', maxAge: 10*60*1000}); 
            res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24*60*60*1000});

            return res.status(200).json({
                message: "login Successfull!",
                accessToken,
                refreshToken,
                userdata: user
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

const refresh = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const refreshToken = cookies.refreshToken;
        if (!refreshToken) throw createError.BadRequest();
        const user = await verifyRefreshToken(refreshToken); //resolves user

        const accessToken = await signAccessToken(user);
        // const refToken = await signRefreshToken(user); //no new refresh token generation

        //clear expired access-token
        res.clearCookie('accessToken');

        //save new access-token generated        
        res.cookie('accessToken', accessToken, {httpOnly: true, sameSite: 'None', maxAge: 10*60*1000});
        
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        next(error)
    }
}

const logout = async(req, res, next) =>{
    //check if accessToken & refreshToken cookies are present.
    //if not give message: already loggedout.
    const cookies = req.cookies;
    const accessToken = cookies.accessToken;
    const refreshToken = cookies.refreshToken;
    if(!accessToken && !refreshToken){
        res.json({message:"Already Logged-out."})
        return
    }
    res.clearCookie('accessToken', {httpOnly: true, sameSite: 'None', maxAge: 10*60*1000});
    res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'None', maxAge: 10*60*1000});
    //add secure:true in option for production server.

    res.json({message: "Logout successful."})
}

//Note: verifyAccessToken function can handle route protection.

// const protectedRoute = async (req, res, next) => {

//     // let token = req.headers['x-access-token'] || req.headers['authorization'];
//     //     if(token.startwith( ('Bearer '))){
//     //         token = token. splice(7, token. length);
//     //     }

//     res.status(200).json({ message: "This is protected route" });
// }


module.exports = {
    signUp,
    signUp_verifyOtp,
    signIn,
    signIn_verifyOtp,
    refresh,
    logout
}