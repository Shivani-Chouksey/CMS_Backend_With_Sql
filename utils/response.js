function Success_Response({ res, data = {}, message = 'Success', statusCode = 200 }) {
    return res.status(statusCode).json({ Success: true, message, data })
}

function Error_Response(res, message = 'Internal Server Error', statusCode = 500, error = null) {
    console.log("Error_Reponse", error);
    return res.status(statusCode).json({ Success: false, message, error })
}

function Conflict_Reponse(res, message, statusCode = 409) {
    return res.status(statusCode).json({ Success: false, message, message })
}



function sendResponse(res, { statusCode = 200, message = '', data = undefined, error = undefined }) {
    const response = {
        success: statusCode >= 200 && statusCode < 300, message
    }
    // only add data if provided
    if (data != undefined && data !== null) {
        response.data = data
    }
    // only add error if provided
    if (error != undefined && error !== null) {
        response.error = error
    }
    return res.status(statusCode).json(response)
}


function Success(res, data, message = 'Success', statusCode = 200) {
    return sendResponse(res, { statusCode, message, data })
}

function Created(res, data, message = 'Created', statusCode = 201) {
    return sendResponse(res, { statusCode, message, data })
}

function Unauthorized(res, message = 'Unauthorized', error = null, statusCode = 401) {
    return sendResponse(res, { statusCode, message, error })
}
function NotFound(res, message = 'Not Found', error = null, statusCode = 404) {
    return sendResponse(res, { statusCode, message, error })
}
function Conflict(res, message = 'Conflict', error = null, statusCode = 409) {
    return sendResponse(res, { statusCode, message, error })
}
function ValidationError(res, errors = [], message = 'Validation Error', statusCode = 422) {
    return sendResponse(res, { statusCode, message, error: errors })
}
function ServerError(res, message = 'Internal Server Error', error = null, statusCode = 422) {
    console.log("Server Error:", error);

    return sendResponse(res, { statusCode, message, error })
}





export { Success, Conflict, Created,ServerError ,Unauthorized,NotFound,ValidationError}
