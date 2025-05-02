import express, { json } from 'express'
import { createPostRouter } from './routes/posts.js'

export function createServer ({ PostModel }) {
  const app = express()
  const port = 3000

  app.use(json())
  app.use('/posts', createPostRouter({ PostModel }))
  app.use((req, res) => {
    res.status(404).json({ error: 'Path not found' })
  })

  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
  })
}
