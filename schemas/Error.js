function sendErrorAsResponse (res, error) {
  if (error.origin) console.error(error.origin)

  const { name, statusCode = 500, message, conflicts } = error
  const response = {
    errorName: name, message, code: statusCode
  }

  if (conflicts) {
    response.conflics = conflicts
  }

  res.status(error.statusCode ?? 500).json(response)
}

class RequestError extends Error {
  constructor (message, statusCode, name, origin) {
    super(message)
    this.statusCode = statusCode
    this.name = name
    this.origin = origin
  }
}

class WriteFileError extends RequestError {
  constructor (message = 'Something went wrong while writing the data') {
    super(message, 500, "'WriteFileError'")
  }
}

class ResourceNotFoundError extends RequestError {
  constructor (message = 'The resource requested does not exits') {
    super(message, 404, 'ResourceNotFound')
  }
}

class ValidationError extends RequestError {
  constructor (conflicts, message = 'Errors found while parsing the data') {
    super(message, 400, 'ValidationError')
    this.conflicts = conflicts
  }
}

class InternalError extends RequestError {
  constructor (origin, message = 'An unexpetec error has happend') {
    super(message, 500, 'Internal Error', origin)
  }
}

export {
  WriteFileError,
  ResourceNotFoundError,
  ValidationError,
  InternalError,
  sendErrorAsResponse
}
