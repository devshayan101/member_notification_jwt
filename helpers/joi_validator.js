const Joi = require('joi');

//signUp-otp generation
const signUpOtpSchema = Joi.object({
    name: Joi.string().lowercase().alphanum(),
    number: Joi.number().required(),
    place: Joi.string().lowercase().alphanum().required(),

});

//signup-otp verification
const signUpOtpVerifySchema = Joi.object({
    name: Joi.string().lowercase().alphanum().required(),
    number: Joi.number().required(),
    place: Joi.string().lowercase().alphanum().required(),
    otp: Joi.string().lowercase().alphanum().required() // data and hash must be strings. This cant be number only string for hashing.
});

//signin-otp generation
const signInOtpSchema = Joi.object({
    number: Joi.number().required()

});

//signin-otp verification
const signInOtpVerifySchema = Joi.object({
    number: Joi.number().required(),
    otp: Joi.string().lowercase().alphanum().required()
})

module.exports = {
    signUpOtpSchema,
    signUpOtpVerifySchema,
    signInOtpSchema,
    signInOtpVerifySchema
}