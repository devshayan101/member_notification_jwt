
const {MemberDonation} = require('../Models/memberDonateModel');
const JWT = require("jsonwebtoken");
const _ = require('lodash');

const memberDonationDataSavePost = async(req, res, next) =>{

//1. testing data in console in req.body
//2. decode accessToken to get userdata /
//3. save name, phone number and amount to database[mongodb]

    try{
        const userAmount =_.pick(req.body, ['amount'])
        //FAULT -- take number only from token.

        // const savedData = await userAmount.save();
        console.log(userAmount);
        // res.json(savedData);

        const tokenData = req.cookies;
        const accessToken = tokenData.accessToken;
        

        const jwtdecode = JWT.decode(accessToken);
        console.log(jwtdecode);
        
        
        const jwtdecodeSubString = jwtdecode.sub;        

        const  resultJsonTokenData = JSON.parse(jwtdecodeSubString);
        console.log(`resultJsonTokenData:`,resultJsonTokenData);
        const totalData = {...resultJsonTokenData, ...userAmount}
        //combine data from token and user-input data.
        console.log(`totalData:`,totalData);

        const memberDonationData = new MemberDonation(_.pick(totalData, ['number', 'name', 'place', 'amount']));
        console.log(memberDonationData)
        await memberDonationData.save();

        res.json(memberDonationData);
        //All steps done.
    }
    catch(error){
        next(error);
    }
}

module.exports ={memberDonationDataSavePost}