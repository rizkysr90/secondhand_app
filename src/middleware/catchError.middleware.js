const { CustomError } = require('./../utility/responseModel');

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

module.exports = {
    logsErrors,
    handleErrors
}