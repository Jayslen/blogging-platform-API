import { Router } from 'express'
import { PostControl } from '../controlls/post.js'

export const postRouter = Router()

postRouter.get('/', PostControl.getAllPost)
postRouter.get('/:id', PostControl.getPostById)
postRouter.post('/', PostControl.createPost)
postRouter.put('/:id', PostControl.updatePost)
postRouter.delete('/:id', PostControl.deletePost)
