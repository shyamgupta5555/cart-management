async function sendResponse(res, status, statusCode, message, data) {
  if (status === true) {
    return res.status(statusCode).json({
      status: status,
      message: message,
      data: data,
    });
  } else {
    return res.status(statusCode).json({
      status: status,
      message: message,
    });
  }
}

module.exports = { sendResponse };
