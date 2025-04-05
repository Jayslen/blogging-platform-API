import { Binary } from 'mongodb'
import { InternalError, ResourceNotFoundError } from '../../schemas/Error.js'
import { MongoDB } from './MongoClient.js'
import { randomUUID } from 'node:crypto'

export class PostModel {
  static createPost = async ({ input }) => {
    const { title, content, category, tags } = input
    const createdAt = new Date()
    const binUuid = new Binary(Buffer.from(randomUUID().replace(/-/g, ''), 'hex'), 4)
    const client = new MongoDB()

    try {
      await client.connect()
      const collection = client.db
      await collection.insertOne({ _id: binUuid, title, content, category, tags, createdAt, updatedAt: createdAt })

      return await collection.findOne({ _id: binUuid })
    } catch (originError) {
      throw new InternalError(originError)
    } finally {
      await client.close()
    }
  }

  static updatePost = async ({ id, input }) => {
    const client = new MongoDB()
    try {
      await client.connect()
      const binUuid = new Binary(Buffer.from(id.replace(/-/g, ''), 'hex'), 4)
      const collection = client.db

      const update = await collection.updateOne({ _id: binUuid }, {
        $set: {
          ...input,
          updatedAt: new Date()
        }
      })

      if (update.matchedCount === 0) { throw new ResourceNotFoundError() }

      return await collection.findOne({ _id: binUuid })
    } catch (originError) {
      if (originError instanceof ResourceNotFoundError) {
        throw originError
      }
      throw new InternalError(originError)
    } finally {
      await client.close()
    }
  }

  static deletePosts = async ({ id }) => {

  }

  static getPostById = async ({ id }) => {
    const client = new MongoDB()
    const binUuid = new Binary(Buffer.from(id.replace(/-/g, ''), 'hex'), 4)

    try {
      await client.connect()
      const collection = client.db
      const posts = await collection.findOne({ _id: binUuid })

      if (!posts) throw new ResourceNotFoundError()

      return posts
    } catch (originError) {
      if (originError instanceof ResourceNotFoundError) {
        throw originError
      }
      throw new InternalError(originError)
    } finally {
      await client.close()
    }
  }

  static getAllPost = async ({ term }) => {
    const client = new MongoDB()

    try {
      await client.connect()
      const collection = client.db

      const regex = new RegExp(term, 'i')
      return await collection.find({ $or: [{ title: { $regex: regex } }, { category: { $regex: regex } }, { content: { $regex: regex } }] }).toArray()
    } catch (originError) {
      throw new InternalError(originError)
    } finally {
      await client.close()
    }
  }
}
