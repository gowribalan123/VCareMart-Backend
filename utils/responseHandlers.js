// Function to send error responses
export const sendError = (res, statusCode, message) => {
    console.error(`Error ${statusCode}: ${message}`); // Log the error
    return res.status(statusCode).json({
        status: "error",
        message: message
    });
};

// Function to send success responses
export const sendSuccess = (res, statusCode = 200, message = "Operation successful", data = null) => {
    return res.status(statusCode).json({
        status: "success",
        message: message,
        data: data
    });
};