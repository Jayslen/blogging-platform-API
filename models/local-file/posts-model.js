import fs from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const postJSON = require('./posts.json')

export class PostModel {
  static createPost = async ({ input }) => {
    const id = crypto.randomUUID()
    const createdAt = new Date()
    postJSON.push({ id, ...input, createdAt, updatedAt: createdAt })
    try {
      await fs.writeFile('./posts.json', JSON.stringify(postJSON))
    } catch {
      throw new Error('Something went wrong when writing the data')
    }

    return postJSON[postJSON.length - 1]
  }

  static updatePost = async ({ id, input }) => {
    const currentPostId = postJSON.findIndex(post => post.id === id)

    if (currentPostId === -1) {
      throw new Error('No post found with the id provided')
    }

    postJSON[currentPostId] = { ...postJSON[currentPostId], ...input, updatedAt: new Date() }

    try {
      await fs.writeFile('./posts.json', JSON.stringify(postJSON))
    } catch {
      throw new Error('Something went wrong when writing the data')
    }

    return postJSON[currentPostId]
  }

  static deletePost = async ({ id }) => {
    const currentPostId = postJSON.findIndex(post => post.id === id)

    if (currentPostId === -1) {
      throw new Error('No post found with the id provided')
    }

    const postDeleted = postJSON[currentPostId]
    postJSON.splice(currentPostId, 1)

    try {
      await fs.writeFile('./posts.json', JSON.stringify(postJSON))
    } catch {
      throw new Error('Something went wrong when writing the data')
    }

    return postDeleted
  }

  static getPostById = async ({ id }) => {
    const currentPost = postJSON.find(post => post.id === id)

    if (!currentPost) {
      throw new Error('No post found with the id provided')
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
