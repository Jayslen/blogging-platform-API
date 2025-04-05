import { MongoClient, ServerApiVersion } from 'mongodb'

let instance

export class MongoDB {
  constructor () {
    if (!instance) {
      instance = this
      this.client = null
      this.db = null
    }
    return instance
  }

  async connect () {
    if (!this.db) {
      this.client = new MongoClient(process.env.MONGO_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true
        }
      })

      await this.client.connect()
      this.db = this.client.db('posts_api').collection('posts')
    }
    return this.db
  }

  async close () {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }
}
