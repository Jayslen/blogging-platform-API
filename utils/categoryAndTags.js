import { InternalError } from '../schemas/Error.js'

export async function getCategoryFromDB (conn, category) {
  try {
    const [[categoryIdSaved]] = await conn.query('SELECT id FROM categories WHERE LOWER(title) = LOWER(?)', [category])

    if (!categoryIdSaved?.id) {
      await conn.query('INSERT INTO categories (title) VALUES (LOWER(?))', [category])
      const [[{ id: categoryCreatedId }]] = await conn.query('SELECT id, title FROM categories WHERE title = LOWER(?)', [category])
      return categoryCreatedId
    } else {
      return categoryIdSaved.id
    }
  } catch (e) {
    throw new InternalError(e)
  }
}

export async function getTagsFromDB (conn, tags = []) {
  const conditions = Array(tags.length).fill(' title = ? ').join('OR')
  const tagsQuery = 'SELECT * FROM tags WHERE' + conditions
  try {
    const [tagsInDB] = await conn.query(tagsQuery, tags)
    const newTags = [...new Set(tags).difference(new Set(tagsInDB.map((item) => item.title)))]

    if (newTags.length > 0) {
      const tagsSetClause = Array(newTags.length).fill('(LOWER(?))').join(',')
      await conn.query('INSERT INTO tags(title) VALUES' + tagsSetClause, newTags)
    }

    const [tagsIds] = await conn.query(tagsQuery, tags)

    return tagsIds
  } catch (e) {
    throw new InternalError(e)
  }
}
