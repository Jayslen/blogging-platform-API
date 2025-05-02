import { Router } from 'express'
import { PostControl as Controller } from '../controlls/post.js'

export function createPostRouter ({ PostModel }) {
  const postRouter = Router()
  const PostControl = new Controller({ PostModel })

  postRouter.get('/', PostControl.getAllPost)
  postRouter.get('/:id', PostControl.getPostById)
  postRouter.post('/', PostControl.createPost)
  postRouter.put('/:id', PostControl.updatePost)
  postRouter.delete('/:id', PostControl.deletePost)

  return postRouter
}
