import { createServer } from './app.js'
import { PostModel } from './models/local-file/posts.js'

createServer({ PostModel })
