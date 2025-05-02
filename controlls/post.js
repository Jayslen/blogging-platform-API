import { sendErrorAsResponse, ValidationError } from '../schemas/Error.js'
import { validatePartialPost, validatePost } from '../schemas/validations.js'

export class PostControl {
  constructor ({ PostModel }) {
    this.PostModel = PostModel
  }

  getAllPost = async (req, res) => {
    const { term } = req.query

    try {
      res.json(await this.PostModel.getAllPost({ term }))
    } catch (e) {
      sendErrorAsResponse(res, e)
    }
  }

  getPostById = async (req, res) => {
    const { id } = req.params

    try {
      res.status(200).json(await this.PostModel.getPostById({ id }))
    } catch (e) {
      sendErrorAsResponse(res, e)
    }
  }

  createPost = async (req, res) => {
    const parsedData = validatePost(req.body)

    if (!parsedData.success) {
      const errors = parsedData.error.issues.map((err) => {
        return {
          value: err.path[0],
          typeError: err.code,
          valueExpected: err.expected,
          valueReceived: err.received,
          message: err.message
        }
      })

      return sendErrorAsResponse(res, new ValidationError(errors))
    }

    try {
      res.status(201).json(await this.PostModel.createPost({ input: parsedData.data }))
    } catch (e) {
      sendErrorAsResponse(res, e)
    }
  }

  updatePost = async (req, res) => {
    const parsedData = validatePartialPost(req.body)
    const { id } = req.params

    if (!parsedData.success) {
      const errors = parsedData.error.issues.map((err) => {
        return {
          value: err.path[0],
          typeError: err.code,
          valueExpected: err.expected,
          valueReceived: err.received,
          message: err.message
        }
      })
      return sendErrorAsResponse(res, new ValidationError(errors))
    }

    try {
      res.status(201).json(await this.PostModel.updatePost({ id, input: parsedData.data }))
    } catch (e) {
      console.error(e)
      sendErrorAsResponse(res, e)
    }
  }

  deletePost = async (req, res) => {
    const { id } = req.params

    try {
      res.status(201).json(await this.PostModel.deletePost({ id }))
    } catch (e) {
      sendErrorAsResponse(res, e)
    }
  }
}
