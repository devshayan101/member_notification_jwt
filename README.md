
# Otpauth

Otpauth is an authentication system that uses one-time passwords (OTPs) to secure user accounts. It is built using Node.js, Express, Mongoose, and other popular JavaScript libraries.

## Features

- Generate OTPs using the `otp-generator` library.
- Secure user accounts with bcrypt. 
- Validate user input with express-validator and Joi. 
- Use JSON Web Tokens for authentication. 
- Store data in MongoDB with Mongoose. 
- Send SMS messages with Twilio. 
- Use Redis for caching and session management. 
- Resize images with Sharp. 
- Use CORS for cross origin resource sharing. 
- Log requests with Morgan and HTTP errors with http-errors. 

 ## Installation 

 To install Otpauth, clone the repository and run `npm install` to install all of the dependencies listed in the `package.json` file:

 ```sh
 git clone https://github.com/username/otpauth.git && cd otpauth && npm install 
 ```

 Then run `npm start` to start the server:

 ```sh 
 npm start 
 ```