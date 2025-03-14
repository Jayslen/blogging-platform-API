class RequestError extends Error {
  constructor (message, statusCode, name) {
    super(message)
    this.statusCode = statusCode
    this.name = name
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

export {
  WriteFileError,
  ResourceNotFoundError,
  ValidationError
}
