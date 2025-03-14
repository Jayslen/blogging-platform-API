import express, { json } from 'express'
import { postRouter } from './routes/posts.js'

const app = express()
const port = 3000

app.use(json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.use('/posts', postRouter)
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
