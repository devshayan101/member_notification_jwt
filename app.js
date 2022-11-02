const express = require('express');
const app = express();
const userRouter = require('./Routers/userRouter');
const screenRouter = require('./Routers/screenRouter')
const morgan = require('morgan');
const httpErrors = require('http-errors');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

app.use(morgan('dev')) //logging

app.set('view engine', 'ejs');     //for ejs  
app.use(expressLayouts);          //for ejs


//for passing data from forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/screens", screenRouter);

// app.get("/", (req, res, next) => {
//     res.render("homeScreen.ejs");
// });

// app.get("/contribute")

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