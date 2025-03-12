class RequestError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

class WriteFileError extends RequestError {
  constructor (message = 'Something went wrong while writing the data') {
    super(message, 500)
    this.name = 'WriteFileError'
  }
}

class ResourceNotFoundError extends RequestError {
  constructor (message = 'The resource requested does not exits') {
    super(message, 404)
    this.name = 'ResourceNotFound'
  }
}

class ValidationError extends RequestError {
  constructor (errors, message = 'Errors found while parsing the data') {
    super(message, 400)
    this.name = 'ValidationError'
    this.conflict = errors
  }
}

export {
  WriteFileError,
  ResourceNotFoundError,
  ValidationError
}
