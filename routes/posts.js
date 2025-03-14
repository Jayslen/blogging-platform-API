import { Router } from 'express'
import { PostModel } from '../models/local-file/posts-model.js'
import { ValidationError, sendErrorAsResponse } from '../schemas/Error.js'
import { validatePartialPost, validatePost } from '../schemas/validations.js'

export const postRouter = Router()

postRouter.get('/', async (req, res) => {
  const { term } = req.query

  try {
    res.json(await PostModel.getAllPost({ term }))
  } catch (e) {
    sendErrorAsResponse(res, e)
  }
})

postRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    res.status(200).json(await PostModel.getPostById({ id }))
  } catch (e) {
    sendErrorAsResponse(res, e)
  }
})

postRouter.post('/', async (req, res) => {
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
})

postRouter.put('/:id', async (req, res) => {
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
})

postRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    res.status(201).json(await PostModel.deletePost({ id }))
  } catch (e) {
    sendErrorAsResponse(res, e)
  }
})
