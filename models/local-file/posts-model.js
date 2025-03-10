import fs from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const data = require('./posts.json')

export class PostModel {
  constructor () {
    this.data = require('./posts.json')
  }

  static createPost = async ({ input }) => {
    const id = crypto.randomUUID()
    const createdAt = new Date()
    data.push({ id, ...input, createdAt, updatedAt: createdAt })
    try {
      await fs.writeFile('./posts.json', JSON.stringify(data))
    } catch {
      throw new Error('Something went wrong when writing the data')
    }

    return data[data.length - 1]
  }

  static updatePost = async ({ id, input }) => {
    const currentPostId = data.findIndex(post => post.id === id)

    if (currentPostId === -1) {
      throw new Error('No post found with the id provided')
    }

    data[currentPostId] = { ...data[currentPostId], ...input, updatedAt: new Date() }

    try {
      await fs.writeFile('./posts.json', JSON.stringify(data))
    } catch {
      throw new Error('Something went wrong when writing the data')
    }

    return data[currentPostId]
  }

  static deletePost = async ({ id }) => {
    const currentPostId = data.findIndex(post => post.id === id)

    if (currentPostId === -1) {
      throw new Error('No post found with the id provided')
    }

    const postDeleted = data[currentPostId]
    data.splice(currentPostId, 1)

    try {
      await fs.writeFile('./posts.json', JSON.stringify(data))
    } catch {
      throw new Error('Something went wrong when writing the data')
    }

    return postDeleted
  }

  static getPostById = async ({ id }) => {
    const currentPost = data.find(post => post.id === id)

    if (!currentPost) {
      throw new Error('No post found with the id provided')
    }

    return currentPost
  }

  static getAllPost = async () => {
    return data
  }
}
