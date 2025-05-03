import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'
import { join } from 'path'
import { WriteFileError, ResourceNotFoundError } from '../../schemas/Error.js'

const require = createRequire(import.meta.url)
const postJSON = require('./posts.json')
const jsonPath = join(process.cwd(), '/models/local-file/posts.json')

export class PostModel {
  static createPost = async ({ input }) => {
    const id = randomUUID()
    const createdAt = new Date()
    postJSON.push({ id, ...input, createdAt, updatedAt: createdAt })

    try {
      await fs.writeFile(jsonPath, JSON.stringify(postJSON))
    } catch {
      throw new WriteFileError()
    }

    return postJSON[postJSON.length - 1]
  }

  static updatePost = async ({ id, input }) => {
    const currentPostId = postJSON.findIndex(post => post.id === id)

    if (currentPostId === -1) {
      throw new ResourceNotFoundError()
    }

    postJSON[currentPostId] = { ...postJSON[currentPostId], ...input, updatedAt: new Date() }

    try {
      await fs.writeFile(jsonPath, JSON.stringify(postJSON))
    } catch {
      throw new WriteFileError()
    }

    return postJSON[currentPostId]
  }

  static deletePost = async ({ id }) => {
    const currentPostId = postJSON.findIndex(post => post.id === id)

    if (currentPostId === -1) {
      throw new ResourceNotFoundError()
    }

    const postDeleted = postJSON[currentPostId]
    postJSON.splice(currentPostId, 1)

    try {
      await fs.writeFile(jsonPath, JSON.stringify(postJSON))
    } catch {
      throw new WriteFileError()
    }

    return postDeleted
  }

  static getPostById = async ({ id }) => {
    const currentPost = postJSON.find(post => post.id === id)

    if (!currentPost) {
      throw new ResourceNotFoundError()
    }

    return currentPost
  }

  static getAllPost = async ({ term }) => {
    if (term) {
      return postJSON.filter(({ title, content, category }) => {
        return [title, content, category].some(key =>
          key.toLowerCase().includes(term.toLowerCase())

        )
      })
    }
    return postJSON
  }
}
