function errorMiddleware(err , req ,res , next){

    if (res.headersSent) {
        return next(err);
    }


    console.log("Error Middleware Called");
    res.status(err.statusCode || 500).json({
        ok : false,
        message : err.message
    })
}

module.exports = errorMiddleware;