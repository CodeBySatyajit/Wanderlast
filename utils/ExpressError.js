//extend the built-in error class in express to create custom error class
class ExpressError extends Error {
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

//export the class
module.exports = ExpressError;