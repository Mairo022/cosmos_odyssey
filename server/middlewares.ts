export function errorHandler(err, req, res, next) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500
    const body = { message: err.message }

    console.error("Error: ", {...body, stack: err.stack})

    res.status(statusCode).json(body)
}

export function asyncHandler(fn) {
    return (req, res, next) =>
      Promise.resolve(fn(req, res, next)).catch(next)
}