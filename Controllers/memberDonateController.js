
const {MemberDonation} = require('../Models/memberDonateModel');
const JWT = require("jsonwebtoken");
const _ = require('lodash');

const memberDonationDataSavePost = async(req, res, next) =>{

//1. testing data in console in req.body
//2. decode accessToken to get userdata /

//check for previously set amount with the number. ---important!!!!

//3. save name, phone number and amount to database[mongodb]


    try{
        const userAmount =_.pick(req.body, ['amount'])
        //FAULT -- take number only from token.

        // const savedData = await userAmount.save();
        console.log("userAmount:", userAmount);
        // res.json(savedData);

        const tokenData = req.cookies;
        const accessToken = tokenData.accessToken;
        

        const jwtdecode = JWT.decode(accessToken);
        console.log("jwtdecode:", jwtdecode);
        
        
        const totalData = {...jwtdecode, ...userAmount}
        //combine data from token and user-input data.
        console.log(`totalData:`,totalData);

        await MemberDonation.deleteMany({ number: totalData.number }).then(()=>{
            console.log('Successfully deleted the documents');
        }).catch((error)=>{
            console.log(`document related to ${totalData.number} not found:`, error);
        })
                
        const memberDonationData = new MemberDonation(_.pick(totalData, ['number', 'name', 'place', 'amount']));
        console.log('memberDonationData', memberDonationData)
        //check for previously set amount with the number.

        await memberDonationData.save();

        res.json(memberDonationData);
        //All steps done.
    }
    catch(error){
        next(error);
    }
}

//add thanks msg for new members.


module.exports ={memberDonationDataSavePost}