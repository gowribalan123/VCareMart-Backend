// Function to send error responses
export const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({
        status: "error",
        message: message
    });
};

// Function to send success responses
export const sendSuccess = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        status: "success",
        message: message,
        data: data
    });
};