const sendToken = (user, statusCode, res) => {
    // Creating JWT Token
    const token = user.getJwtToken();

    // Setting cookie options for the token
    const options = {
        expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    // Setting cookie options for the isLoggedIn flag
    const clientOptions = {
        expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000),
    };

    // Setting status, cookie, and response
    res.status(statusCode)
        .cookie('token', token, options)
        .cookie('isLoggedIn', true, clientOptions)
        .json({
            success: true,
            token, 
            user
        });
};

module.exports = sendToken;


const sendTokenEmail = (user, statusCode, res) => {
    // Creating JWT Token
    const token = user.getJwtToken();

    // Setting cookie options
    const options = {
        expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    // Setting status, cookie, and response
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token, 
            user
        });
};

module.exports = sendTokenEmail;

