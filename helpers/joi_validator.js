const Joi = require('joi');

//to-do add country code input


//signUp-otp generation
const signUpOtpSchema = Joi.object({
    code:Joi.number().required(),
    name: Joi.string().lowercase().alphanum(),
    number: Joi.number().required(),
    place: Joi.string().lowercase().alphanum().required(),

});

//signup-otp verification
const signUpOtpVerifySchema = Joi.object({
    code:Joi.number().required(),
    name: Joi.string().lowercase().alphanum().required(),
    number: Joi.number().required(),
    place: Joi.string().lowercase().alphanum().required(),
    otp: Joi.string().lowercase().alphanum().required() // data and hash must be strings. This cant be number only string for hashing.
});

//signin-otp generation
const signInOtpSchema = Joi.object({
    code:Joi.number().required(),
    number: Joi.number().required()

});

//signin-otp verification
const signInOtpVerifySchema = Joi.object({
    code:Joi.number().required(),
    number: Joi.number().required(),
    otp: Joi.string().lowercase().alphanum().required()
})

module.exports = {
    signUpOtpSchema,
    signUpOtpVerifySchema,
    signInOtpSchema,
    signInOtpVerifySchema
}