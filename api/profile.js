import {
  fail,
  publicUser,
  readJson,
  requireUser,
  sendJson,
  serverError,
} from './_lib/auth.js'
import { ensureIndexes, getDb } from './_lib/db.js'

const PLAN_DAYS = { monthly: 30, quarterly: 92, yearly: 365 }
const DAY_MS = 24 * 60 * 60 * 1000

export default async function handler(req, res) {
  try {
    await ensureIndexes()
    const db = await getDb()
    const users = db.collection('users')

    const user = await requireUser(req, res)
    if (!user) return undefined

    if (req.method === 'GET') {
      return sendJson(res, 200, { user: publicUser(user) })
    }

    if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

    const { action, ...body } = await readJson(req)

    /* ---------------- subscribe ---------------- */
    if (action === 'subscribe') {
      const planId = String(body.planId || 'monthly')
      const days = PLAN_DAYS[planId] || 30
      const now = Date.now()
      const sub = {
        planId,
        price: body.price ?? null,
        purchasedAt: now,
        expiresAt: now + days * DAY_MS,
      }
      await users.updateOne({ _id: user._id }, { $set: { sub } })
      return sendJson(res, 200, { sub })
    }

    /* ---------------- cancel ---------------- */
    if (action === 'cancel') {
      await users.updateOne({ _id: user._id }, { $set: { sub: null } })
      return sendJson(res, 200, { ok: true })
    }

    /* ---------------- mark a session as watched ---------------- */
    if (action === 'watched') {
      const sessionId = String(body.sessionId || '')
      if (!sessionId) return fail(res, 400, 'Missing sessionId.')
      await users.updateOne(
        { _id: user._id },
        { $addToSet: { watched: sessionId } },
      )
      return sendJson(res, 200, { ok: true })
    }

    /* ---------------- save a quiz score (best score wins) ---------------- */
    if (action === 'score') {
      const quizId = String(body.quizId || '')
      const score = Number(body.score)
      if (!quizId || Number.isNaN(score)) {
        return fail(res, 400, 'Missing quizId or score.')
      }
      const best = Math.max(score, Number(user.scores?.[quizId] || 0))
      await users.updateOne(
        { _id: user._id },
        { $set: { [`scores.${quizId}`]: best } },
      )
      return sendJson(res, 200, { ok: true, score: best })
    }

    return fail(res, 400, 'Unknown profile action.')
  } catch (e) {
    return serverError(res, e, 'profile')
  }
}
