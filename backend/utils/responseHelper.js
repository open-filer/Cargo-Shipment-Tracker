/**
 * Centralized API Response Helpers
 * Ensures consistent response format across all endpoints
 */

/**
 * Send a successful response
 * @param {Object} res - Express response object
 * @param {*} data - Data to send in response
 * @param {String} message - Optional success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
exports.successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
    const response = {
        success: true,
        message
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {String|Object} error - Error message or error object
 * @param {Number} statusCode - HTTP status code (default: 500)
 */
exports.errorResponse = (res, error, statusCode = 500) => {
    const errorMessage = typeof error === 'string' ? error : error.message;

    const response = {
        success: false,
        error: errorMessage
    };

    // Include stack trace in development mode
    if (process.env.NODE_ENV === 'development' && error.stack) {
        response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
};

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {Array|String} errors - Validation errors
 */
exports.validationErrorResponse = (res, errors) => {
    return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: Array.isArray(errors) ? errors : [errors]
    });
};
