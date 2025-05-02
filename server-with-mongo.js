import { createServer } from './app.js'
import { PostModel } from './models/mongoDB/posts-model.js'

createServer({ PostModel })
