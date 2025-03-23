import { expect, test, describe } from 'vitest'
import request from 'supertest'
import { validatePost } from '../schemas/validations.js'
import app from '../app.js'
import { LocalFileTestSetUp } from './TestSetUp.js'

const TEST_VALUES = await new LocalFileTestSetUp().init()

describe('GET /posts', () => {
  test('Should return successful status and a list of posts', async () => {
    const res = await request(app).get('/posts')
    const postsKey = [...new Set(res.body.flatMap(Object.keys))].sort()

    expect(res.status).toBe(200)
    expect(res.body).instanceOf(Array)
    expect(postsKey).toEqual(TEST_VALUES.postsProperties)
  })
})

describe('GET /posts/:id', () => {
  test('Should return a successful status and single post requested', async () => {
    const res = (await request(app).get(`/posts/${TEST_VALUES.id}`))

    expect(res.status).toBe(200)
    expect(res.body).instanceOf(Object)
    expect(res.body.id).toBe(await TEST_VALUES.id)
  })
})

describe('POST /posts', () => {
  test('User input should satisfied the validations', async () => {
    const res = await request(app).post('/posts').send(TEST_VALUES.newPost)
    const { success, error } = validatePost(res.body)

    if (!success) {
      console.error(error)
    }

    expect(success).toBe(true)
  })

  test('Should return a 201 created status and the post created', async () => {
    const res = (await request(app).post('/posts').send(TEST_VALUES.newPost))

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject(TEST_VALUES.newPost)
  })
})

describe('DELETE /posts/:id', () => {
  test('Should return 201 status and the post deleted', async () => {
    const res = await request(app).delete(`/posts/${TEST_VALUES.removedId}`)
    const postsKey = Object.keys(res.body).sort()

    expect(res.status).toBe(201)
    expect(postsKey).toEqual(postsKey)
    expect(res.body.id).toBe(TEST_VALUES.removedId)
  })
})
