module.exports = (err, req, res, next) => {
    // console.error("Error:", err); 

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (process.env.NODE_ENV === 'development') {
        return res.status(statusCode).json({
            success: false,
            message: message,
            stack: err.stack,
            error: err,
        });
    }

    if (process.env.NODE_ENV === 'production') {
        if (err.name === "ValidationError") {
            message = Object.values(err.errors).map(value => value.message).join(", ");
            statusCode = 400;
        }

        if (err.name === "CastError") {
            message = `Invalid ${err.path}: ${err.value}`;
            statusCode = 400;
        }

        if (err.code === 11000) {
            message = `Duplicate ${Object.keys(err.keyValue)} error`;
            statusCode = 400;
        }

        if (err.name === "JsonWebTokenError") {
            message = "Invalid JSON Web Token. Please try again.";
            statusCode = 401;
        }

        if (err.name === "TokenExpiredError") {
            message = "JSON Web Token has expired. Please log in again.";
            statusCode = 401;
        }

        return res.status(statusCode).json({
            success: false,
            message: message,
        });
    }

    // ✅ Final fallback to prevent undefined status codes
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
