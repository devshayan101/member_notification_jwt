//1. Check for accessToken in header

//2. save name, phone number and amount to database[mongodb]
const test = (req, res)=>{
    const cookies = req.cookies;
    //if(!cookies?.accessToken) return res.sendStatus(401);
    console.log("access-token",cookies.accessToken);
    console.log("refresh-token",cookies.refreshToken);

   return res.send('Auth-route --contributionScreen.ejs');
}

module.exports={
    test
}