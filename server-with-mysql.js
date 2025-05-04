import { createServer } from './app.js'
import { PostModel } from './models/mysql/posts.js'

createServer({ PostModel })
