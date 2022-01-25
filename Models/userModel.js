const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');
//phone number for otp
const userSchema = new Schema({
    number: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    place: {
        type: String
    }
}, { timestamps: true });

// userSchema.methods.generateJWT = function () {
//     const token = jwt.sign({
//         _id: this._id,
//         number: this.number,
//         name: this.name
//     }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
//     return token;
// }
module.exports.User = model('User', userSchema);