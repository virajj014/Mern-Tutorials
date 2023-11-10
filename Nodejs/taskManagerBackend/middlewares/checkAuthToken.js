const jwt = require('jsonwebtoken');

function checkAuthToken(req, res, next) {
    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;

    console.log("INSIDE CHECK AUTH TOKEN MIDDLEWARE");
    // console.log(authToken);
    // console.log(refreshToken);



    // CLEARED COOKIES
    if (!authToken || !refreshToken) {
        return res.status(401).json({ message: 'Authentication failed: No authToken or refreshToken provided', ok: false });
    }


    jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            // AUTH TOKEN EXPIRED -> CHECK REFRESH TOKEN
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (refresherr, refreshdecoded) => {
                if (refresherr) {
                    // BOTH TOKENS EXPIRED
                    console.log("BOTH TOKENS EXPIRED");
                    return res.status(401).json({ message: 'Authentication failed: No authToken or refreshToken provided', ok: false });
                }
                else {

                    const newauthToken = jwt.sign({ userId: refreshdecoded.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
                    const newrefreshToken = jwt.sign({ userId: refreshdecoded.userId }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '30m' });
                    res.cookie('authToken', newauthToken, { httpOnly: true });
                    res.cookie('refreshToken', newrefreshToken, { httpOnly: true });
                    console.log("NEW TOKENS REGENERATED");
                    req.userId = refreshdecoded.userId;
                    req.ok = true;
                    next();
                }
            })

        }
        else {
            console.log("AUTH TOKEN & REFRESH TOKEN IS VALID");
            req.ok = true;
            req.userId = decoded.userId;
            next();
        }
    })



}

module.exports = checkAuthToken;