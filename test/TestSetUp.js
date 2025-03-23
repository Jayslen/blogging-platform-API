import fs from 'node:fs/promises'
import path from 'node:path'

class TestProperties {
  constructor () {
    this.newPost = {
      title: 'Post example',
      content: 'This is the content of my first blog post.',
      category: 'News',
      tags: ['Test']
    }
    this.postsProperties = [
      'category',
      'content',
      'createdAt',
      'id',
      'tags',
      'title',
      'updatedAt'
    ].sort()
    this.update = {
      title: 'La leyenda de Zelda',
      category: 'videojuegos',
      tags: ['videojuegos', 'Nintendo']
    }
  }
}

export class LocalFileTestSetUp extends TestProperties {
  constructor () {
    super()
    this.id = null
    this.removedId = null
  }

  async init () {
    this.id = await this.#getRandomId()
    this.removedId = await this.#getRandomId()
    return this
  }

  #getRandomId = async () => {
    try {
      const posts = JSON.parse(await fs.readFile(path.join(process.cwd(), 'models/local-file/posts.json'), 'utf-8'))
      return posts[Math.floor(Math.random() * posts.length)].id
    } catch (e) {
      return e
    }
  }
}
