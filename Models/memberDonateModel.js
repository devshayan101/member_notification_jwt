const { Schema, model } = require('mongoose');
//phone number for otp
const membersSchema = new Schema({
    number: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    place:{
        type:String,

    },
    amount:{
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports.MemberDonation = model('MemberDonation', membersSchema);