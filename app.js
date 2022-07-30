require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./src/router/index');
const path = require('path');
const { CustomError } = require('./src/utility/responseModel')

function logsErrors(err,req,res,next) {
    console.error(err);
    next(err);
}
function handleErrors(err,req,res,next) {

    let customError = err;
    if (!(err instanceof CustomError)) {
        customError = new CustomError();
    }
    res.status(customError.status).json({
        code : customError.status,
        message : customError.message,
        info : customError.additionalInfo
    })
}
app.use(cors())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use('/static',express.static(path.join(__dirname, 'static')))
app.get('/',(req,res) => {
    res.status(200).send('Hello FEJS1 X BEJS2')
})
// Main Route
app.use(`${process.env.BASE_URL}`, router)

// Errpr Logs
app.use(logsErrors);
app.use(handleErrors);
// Invalid Path
app.all('*',(req,res) => {
    res.status(404).json({message :"Sorry, page not found"});
});





module.exports = app