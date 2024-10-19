require('dotenv/config'); 

const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN); 

const sms = (toNumber, OTP)=>{ 
    client.messages 
      .create({ 
         body: `Your OTP for Khanqah-e-Rah-e-Sulook is ${OTP}`,

         messagingServiceSid: 'MG2d279e7e6ee63d6e29073967748b24ee',  

         to: toNumber
       }) 
      .then(message => console.log(message.sid)) 
      .catch(error=>console.error(error))
      .done();
    }

module.exports={
        sms
    }