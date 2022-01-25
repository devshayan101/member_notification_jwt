const express = require('express');
const app = express();
const userRouter = require('./Routers/userRouter');
const morgan = require('morgan');
const httpErrors = require('http-errors');
require('./helpers/init_redis');

app.use(morgan('dev')) //logging

//for passing data from forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", userRouter);

app.get("/", async (req, res, next) => {
    res.send("Welcome to the API");
});

//404 Handler
app.use(async (res, req, next) => {
    const error = new Error("Page Not Found");
    error.status = 404;
    next(error);
});

//Error Handler
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message,
        error: error
    });
})


module.exports = app