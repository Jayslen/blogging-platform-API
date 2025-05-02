import { createServer } from './app.js'
import { PostModel } from './models/local-file/posts-model.js'

createServer({ PostModel })
