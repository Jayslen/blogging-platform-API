import mysql from 'mysql2/promise'
import { InternalError, NoInputSend, ResourceNotFoundError } from '../../schemas/Error.js'
import { getCategoryFromDB, getTagsFromDB } from '../../utils/categoryAndTags.js'

const config = {
  host: process.env.MYSQL_HOST || 'localhos',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  database: process.env.MYSQL_DATABASE || 'posts'
}

const conn = await mysql.createConnection(config)

export class PostModel {
  static createPost = async ({ input }) => {
    const { title, content, category, tags } = input

    try {
      const categoriesDB = await getCategoryFromDB(conn, category)
      const tagsDB = await getTagsFromDB(conn, tags)
      const [[{ uuid }]] = await conn.query('SELECT UUID() AS uuid')

      const tagsInsertQuery = 'INSERT INTO posts_tags (post_id, tag_id) VALUES' + Array(tagsDB.length).fill(`(UUID_TO_BIN('${uuid}'),?)`).join(',')
      const tagsParameters = tagsDB.map(({ id }) => id)

      await conn.query('INSERT INTO post (id, title, content, category) VALUES(UUID_TO_BIN(?), ?, ?, ?)', [uuid, title, content, categoriesDB])
      await conn.query(tagsInsertQuery, tagsParameters)

      const [[post]] = await conn.query('SELECT * FROM posts_views WHERE id = ?', [uuid])

      post.tags = tagsDB?.map(({ title }) => title)
      return post
    } catch (e) {
      throw new InternalError(e)
    }
  }

  static updatePost = async ({ id: postId, input }) => {
    if (Object.keys(input).length === 0) {
      throw new NoInputSend()
    }
    try {
      const [posts] = await conn.query('SELECT * FROM posts_with_tags WHERE id = ?', [postId])

      if (posts.length === 0) {
        throw new ResourceNotFoundError()
      }
      const postTags = []
      let postQueryUpdate = 'UPDATE post SET updatedAT = ? '

      const nonRelationalFields = Object.entries(input).filter(([key]) => key !== 'category' && key !== 'tags')
      const [[{ date }]] = await conn.query('SELECT current_timestamp() AS date')

      if (nonRelationalFields.length > 0) {
        const setClause = ',' + nonRelationalFields.map(([key]) => `${key} = ?`).join(', ')
        postQueryUpdate += setClause
      }

      postQueryUpdate += ' WHERE id = UUID_TO_BIN(?)'

      const params = nonRelationalFields.map(([_, value]) => value)

      // update title, content and updatedAT
      await conn.query(postQueryUpdate, [date, ...params, postId])

      // update categoty
      if (input?.category) {
        const categoryId = await getCategoryFromDB(conn, input.category)
        await conn.query('UPDATE post SET category = ? WHERE id = UUID_TO_BIN(?)', [categoryId, postId])
      }

      // update tags
      if (input?.tags) {
        const tags = await getTagsFromDB(conn, input.tags)
        postTags.push(...tags)
        const tagsParams = tags.flatMap(({ id: tagId }) => [postId, tagId])
        const queryValuesPart = Array(tags.length).fill('(UUID_TO_BIN(?), ?)').join(', ')
        await conn.query('DELETE FROM posts_tags WHERE post_id = UUID_TO_BIN(?)', [postId])
        await conn.query('INSERT INTO posts_tags (post_id, tag_id) VALUES ' + queryValuesPart, tagsParams)
      }

      const [[post]] = await conn.query('SELECT * FROM posts_views WHERE id = ?', [postId])
      post.tags = postTags?.map(({ title }) => title)

      return { meesage: 'Post updated', postUpdated: post }
    } catch (originError) {
      if (originError instanceof ResourceNotFoundError || originError instanceof NoInputSend) {
        throw originError
      }
      throw new InternalError(originError)
    }
  }

  static deletePost = async ({ id: postId }) => {
    try {
      const [post] = await conn.query('SELECT * FROM posts_views WHERE id = ?', [postId])
      if (post.length === 0) {
        throw new ResourceNotFoundError()
      }

      await conn.query('DELETE FROM post WHERE id = UUID_TO_BIN(?)', [postId])

      return {
        message: `Post with id: ${postId} deleted`,
        postDeleted: post[0]
      }
    } catch (originError) {
      if (originError instanceof ResourceNotFoundError) {
        throw originError
      }

      throw new InternalError(originError)
    }
  }

  static getPostById = async ({ id: postId }) => {
    try {
      const [posts] = await conn.query('SELECT * FROM posts_with_tags WHERE id = ?', [postId])
      if (posts.length === 0) {
        throw new ResourceNotFoundError()
      }

      const selectedPost = posts[0]
      selectedPost.tags = posts.map(({ tag }) => tag)
      delete selectedPost.tag

      return selectedPost
    } catch (originError) {
      if (originError instanceof ResourceNotFoundError) {
        throw originError
      }

      throw new InternalError(originError)
    }
  }

  static getAllPost = async ({ term }) => {
    let query = 'SELECT * FROM posts_with_tags WHERE 1=1'
    const postsParams = Array(3).fill(`%${term}%`)
    try {
      if (term) {
        query += ' AND (LOWER(p.title) LIKE LOWER(?) OR LOWER(p.content) LIKE LOWER(?)) OR LOWER(category) LIKE LOWER(?)'
      }
      const [posts] = await conn.query(query, postsParams)
      const postsModified = []

      for (let i = 0; i < posts.length; i++) {
        const postsTagsAdded = postsModified?.map(({ id }) => id)
        const currentId = posts[i].id

        if (postsTagsAdded.includes(currentId)) continue

        const currentPostTags = posts.filter(({ id }) => id === currentId).flatMap(({ tag }) => tag)
        const currentPost = posts[i]
        delete currentPost.tag
        postsModified.push({ ...currentPost, tags: currentPostTags })
      }

      return postsModified
    } catch (origin) {
      throw new InternalError(origin)
    }
  }
}
