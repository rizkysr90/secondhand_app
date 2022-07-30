class CustomError {
    constructor(status = 500,message = 'internal server error',additionalInfo = {}) {
        this.message = message;
        this.status = status;
        this.additionalInfo= additionalInfo;
    }
}

module.exports = {
    error(code,message) {
        return {
            code,
            message
        }
    },
    CustomError,
    success(code,data) {
        return {
            code,
            data
        }
    }
}