
const {MemberDonation} = require('../Models/memberDonateModel');
const JWT = require("jsonwebtoken");
const _ = require('lodash');

const memberDonationDataSavePost = async(req, res, next) =>{

//1. testing data in console in req.body
//2. decode accessToken to get userdata /
//3. save name, phone number and amount to database[mongodb]

    try{
        const userdata =_.pick(req.body, ['amount'])//only for indian numbers //further updation needed for international numbers.
        //FAULT -- take number only from token.

        // const savedData = await userdata.save();
        console.log(userdata);
        // res.json(savedData);

        const tokenData = req.cookies;
        const accessToken = tokenData.accessToken;
        

        const jwtdecode = JWT.decode(accessToken);
        console.log(jwtdecode);
        
        //convert token data to JSON object
        //here number and _id only is used
        //add variables if more data extraction is required
        const jwtdecodeSubString = jwtdecode.sub;
        // const resultNumber = jwtdecodeSubString.replace(/number/, `"number"`);
        // const resultNumberId = resultNumber.replace(/_id/, `"_id"`);
        // const resultNumberIdNewObjectId = resultNumberId.replace(`new ObjectId(`,``);
        // const resultNumberIdNewObjectIdBracket = resultNumberIdNewObjectId.replace(`)`,``);
        // console.log(resultNumberIdNewObjectIdBracket);

        //above code is making data extracted from access-token parse-able.

        

        const  resultJsonTokenData = JSON.parse(jwtdecodeSubString);
        console.log(`resultJsonTokenData:`,resultJsonTokenData);
        const totalData = {...resultJsonTokenData, ...userdata}
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