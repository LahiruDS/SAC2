import { ObjectId } from 'mongodb'
import {
  fail,
  readJson,
  requireAdmin,
  sendJson,
  serverError,
} from './_lib/auth.js'
import { ensureIndexes, getBucket, getDb } from './_lib/db.js'

/* Removes the Mongo _id so documents look exactly like they did in Firestore */
const strip = (doc) => {
  if (!doc) return doc
  const { _id, ...rest } = doc
  return rest
}

const COLLECTIONS = {
  session: 'sessions',
  paper: 'papers',
  quiz: 'quizzes',
}

export default async function handler(req, res) {
  try {
    await ensureIndexes()
    const db = await getDb()

    /* ---------------- read everything (public) ---------------- */
    if (req.method === 'GET') {
      const [sessions, papers, quizzes] = await Promise.all([
        db.collection('sessions').find({}).toArray(),
        db.collection('papers').find({}).sort({ createdAt: -1 }).toArray(),
        db.collection('quizzes').find({}).toArray(),
      ])

      return sendJson(res, 200, {
        sessions: sessions.map(strip),
        papers: papers.map(strip),
        quizzes: quizzes.map(strip),
      })
    }

    const type = String(req.query?.type || '')
    const collectionName = COLLECTIONS[type]
    if (!collectionName) {
      return fail(res, 400, 'Unknown content type.')
    }

    /* ---------------- create / update (admin only) ---------------- */
    if (req.method === 'POST') {
      const admin = await requireAdmin(req, res)
      if (!admin) return undefined

      const body = await readJson(req)

      if (type === 'session') {
        const { courseId, session } = body
        if (!session?.id) return fail(res, 400, 'The session needs an id.')
        await db
          .collection('sessions')
          .updateOne(
            { _id: session.id },
            { $set: { courseId, session } },
            { upsert: true },
          )
        return sendJson(res, 200, { ok: true })
      }

      if (!body?.id) return fail(res, 400, `The ${type} needs an id.`)

      const doc = { ...body }
      if (type === 'paper') doc.createdAt = doc.createdAt || Date.now()

      await db
        .collection(collectionName)
        .updateOne({ _id: body.id }, { $set: doc }, { upsert: true })

      return sendJson(res, 200, { ok: true })
    }

    /* ---------------- delete (admin only) ---------------- */
    if (req.method === 'DELETE') {
      const admin = await requireAdmin(req, res)
      if (!admin) return undefined

      const id = String(req.query?.id || '')
      if (!id) return fail(res, 400, 'Missing id.')

      /* Papers also own an uploaded PDF, so clean that up too */
      if (type === 'paper') {
        const paper = await db.collection('papers').findOne({ _id: id })
        const storedId = paper?.fileId || paper?.filePath
        if (storedId) {
          try {
            const bucket = await getBucket()
            await bucket.delete(new ObjectId(String(storedId)))
          } catch (e) {
            console.error('[SAC Labs] Could not delete the stored PDF:', e)
          }
        }
      }

      await db.collection(collectionName).deleteOne({ _id: id })
      return sendJson(res, 200, { ok: true })
    }

    return fail(res, 405, 'Method not allowed')
  } catch (e) {
    return serverError(res, e, 'content')
  }
}
