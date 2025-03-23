import { PostModel } from '../models/local-file/posts-model'
import { sendErrorAsResponse, ValidationError } from '../schemas/Error'
import { validatePartialPost, validatePost } from '../schemas/validations'

export class PostControl {
  static async getAllPost (req, res) {
    const { term } = req.query

    try {
      res.json(await PostModel.getAllPost({ term }))
    } catch (e) {
      sendErrorAsResponse(res, e)
    }
  }

  static async getPostById (req, res) {
    const { id } = req.params

    try {
      res.status(200).json(await PostModel.getPostById({ id }))
    } catch (e) {
      sendErrorAsResponse(res, e)
    }
  }

  static async createPost (req, res) {
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
      res.status(201).json(await PostModel.createPost({ input: parsedData.data }))
    } catch (e) {
      sendErrorAsResponse(res, e)
    }
  }

  static async updatePost (req, res) {
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
      res.status(201).json(await PostModel.updatePost({ id, input: parsedData.data }))
    } catch (e) {
      sendErrorAsResponse(res, e)
    }
  }

  static async deletePost (req, res) {
    const { id } = req.params

    try {
      res.status(201).json(await PostModel.deletePost({ id }))
    } catch (e) {
      sendErrorAsResponse(res, e)
    }
  }
}
