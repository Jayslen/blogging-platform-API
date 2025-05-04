import { createServer } from './app.js'
import { PostModel } from './models/mongoDB/posts.js'

createServer({ PostModel })
