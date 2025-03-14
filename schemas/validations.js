import z from 'zod'

const postSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10),
  category: z.string().min(3).max(20),
  tags: z.array(z.string()).min(1)
})

export function validatePost (input) {
  return postSchema.safeParse(input)
}

export function validatePartialPost (input) {
  return postSchema.partial().safeParse(input)
}
