const responseFunction = (res, status, message, data, ok) => {
    res.status(status).json({
        message: message,
        data: data,
        ok: ok
    });
}

module.exports = responseFunction;