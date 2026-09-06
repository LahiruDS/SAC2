import { ObjectId } from 'mongodb'
import {
  fail,
  normEmail,
  publicListedUser,
  readJson,
  requireUser,
  sendJson,
  serverError,
} from './_lib/auth.js'
import { ensureIndexes, getDb } from './_lib/db.js'

const PLAN_DAYS = { monthly: 30, quarterly: 92, yearly: 365 }
const DAY_MS = 24 * 60 * 60 * 1000

const isAdmin = (user) => (user?.role || 'student') === 'admin'

const toObjectId = (value) => {
  try {
    return new ObjectId(String(value))
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  try {
    await ensureIndexes()
    const db = await getDb()
    const grantsCol = db.collection('grants')
    const requestsCol = db.collection('payRequests')

    const user = await requireUser(req, res)
    if (!user) return undefined
    const admin = isAdmin(user)

    /* ---------------- read ---------------- */
    if (req.method === 'GET') {
      /* Students only ever see their own grant and their own requests */
      const grantFilter = admin ? {} : { _id: user.email }
      const requestFilter = admin ? {} : { email: user.email }

      const [grants, payRequests, users] = await Promise.all([
        grantsCol.find(grantFilter).toArray(),
        requestsCol.find(requestFilter).sort({ requestedAt: -1 }).toArray(),
        admin
          ? db.collection('users').find({}).sort({ email: 1 }).toArray()
          : Promise.resolve([]),
      ])

      return sendJson(res, 200, {
        grants: grants.map(({ _id, ...rest }) => ({ ...rest, email: _id })),
        payRequests: payRequests.map(({ _id, ...rest }) => ({
          ...rest,
          id: String(_id),
        })),
        users: users.map(publicListedUser),
      })
    }

    if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')

    const { action, ...body } = await readJson(req)

    /* ---------------- a student submits payment proof ---------------- */
    if (action === 'submitRequest') {
      const request = {
        name: body.name || user.name || '',
        email: normEmail(body.email || user.email),
        level: body.level || '',
        planId: body.planId,
        price: body.price ?? null,
        method: body.method || '',
        reference: String(body.reference || '').trim(),
        message: String(body.message || '').trim(),
        receiptName: body.receiptName || '',
        requestedAt: Date.now(),
        status: 'pending',
      }
      const created = await requestsCol.insertOne(request)
      return sendJson(res, 201, { id: String(created.insertedId) })
    }

    /* Everything below this point is admin-only */
    if (!admin) {
      return fail(res, 403, 'This action is for the SAC Labs admin only.')
    }

    /* ---------------- grant / extend / revoke access ---------------- */
    if (action === 'grant') {
      const key = normEmail(body.email)
      if (!key) return fail(res, 400, 'Enter a valid student email.')

      const planId = body.planId || 'monthly'
      const days = PLAN_DAYS[planId] || 30
      const now = Date.now()
      const existing = await grantsCol.findOne({ _id: key })

      if (existing) {
        const base = Math.max(now, existing.expiresAt || now)
        await grantsCol.updateOne(
          { _id: key },
          {
            $set: {
              name: body.name || existing.name || key,
              planId: planId || existing.planId || 'monthly',
              note: body.note || existing.note || '',
              grantedAt: existing.grantedAt || now,
              expiresAt: base + days * DAY_MS,
            },
          },
        )
      } else {
        await grantsCol.insertOne({
          _id: key,
          name: body.name || key,
          planId,
          note: body.note || '',
          grantedAt: now,
          expiresAt: now + days * DAY_MS,
        })
      }
      return sendJson(res, 200, { ok: true })
    }

    if (action === 'extend') {
      const key = normEmail(body.email)
      const extraDays = Number(body.extraDays || 30)
      const existing = await grantsCol.findOne({ _id: key })
      if (!existing) return sendJson(res, 200, { ok: true })
      const now = Date.now()
      await grantsCol.updateOne(
        { _id: key },
        {
          $set: {
            expiresAt:
              Math.max(now, existing.expiresAt || now) + extraDays * DAY_MS,
          },
        },
      )
      return sendJson(res, 200, { ok: true })
    }

    if (action === 'revoke') {
      await grantsCol.deleteOne({ _id: normEmail(body.email) })
      return sendJson(res, 200, { ok: true })
    }

    /* ---------------- approve / reject / delete a request ---------------- */
    if (action === 'approveRequest') {
      const _id = toObjectId(body.requestId)
      if (!_id) return fail(res, 400, 'Unknown request.')

      const request = await requestsCol.findOne({ _id })
      if (!request) return fail(res, 404, 'Unknown request.')

      await requestsCol.updateOne(
        { _id },
        { $set: { status: 'approved', approvedAt: Date.now() } },
      )

      /* Approving a payment also grants that student access */
      const key = normEmail(request.email)
      const planId = request.planId || 'monthly'
      const days = PLAN_DAYS[planId] || 30
      const now = Date.now()
      const note = `Approved payment request (${request.method}${
        request.reference ? ' · ref ' + request.reference : ''
      })`
      const existing = await grantsCol.findOne({ _id: key })

      if (existing) {
        const base = Math.max(now, existing.expiresAt || now)
        await grantsCol.updateOne(
          { _id: key },
          {
            $set: {
              name: request.name || existing.name || key,
              planId,
              note,
              grantedAt: existing.grantedAt || now,
              expiresAt: base + days * DAY_MS,
            },
          },
        )
      } else {
        await grantsCol.insertOne({
          _id: key,
          name: request.name || key,
          planId,
          note,
          grantedAt: now,
          expiresAt: now + days * DAY_MS,
        })
      }

      return sendJson(res, 200, { ok: true })
    }

    if (action === 'rejectRequest') {
      const _id = toObjectId(body.requestId)
      if (!_id) return fail(res, 400, 'Unknown request.')
      await requestsCol.updateOne(
        { _id },
        { $set: { status: 'rejected', rejectedAt: Date.now() } },
      )
      return sendJson(res, 200, { ok: true })
    }

    if (action === 'deleteRequest') {
      const _id = toObjectId(body.requestId)
      if (!_id) return fail(res, 400, 'Unknown request.')
      await requestsCol.deleteOne({ _id })
      return sendJson(res, 200, { ok: true })
    }

    return fail(res, 400, 'Unknown access action.')
  } catch (e) {
    return serverError(res, e, 'access')
  }
}
