import {
  ADMIN_EMAIL,
  checkPassword,
  fail,
  hashPassword,
  normEmail,
  publicUser,
  randomToken,
  readJson,
  requireUser,
  sendJson,
  serverError,
  sha256,
  signToken,
} from './_lib/auth.js'
import { ensureIndexes, getDb } from './_lib/db.js'

const RESET_TTL_MS = 60 * 60 * 1000 /* reset links are valid for 1 hour */

/* Sends the reset email if SMTP is configured. Returns true if it was sent. */
async function sendResetEmail(to, link) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return false

  const nodemailer = (await import('nodemailer')).default
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  await transporter.sendMail({
    from: SMTP_FROM || SMTP_USER,
    to,
    subject: 'SAC Labs — reset your password',
    text:
      `Someone asked to reset the password for your SAC Labs account.\n\n` +
      `Open this link to choose a new password:\n${link}\n\n` +
      `The link stops working in one hour. If this wasn't you, you can ` +
      `safely ignore this email.`,
    html:
      `<p>Someone asked to reset the password for your SAC Labs account.</p>` +
      `<p><a href="${link}">Choose a new password</a></p>` +
      `<p style="color:#666;font-size:13px">The link stops working in one hour. ` +
      `If this wasn't you, you can safely ignore this email.</p>`,
  })
  return true
}

export default async function handler(req, res) {
  const action = String(req.query?.action || '')

  try {
    await ensureIndexes()
    const db = await getDb()
    const users = db.collection('users')

    /* ---------------- who am I ---------------- */
    if (action === 'me') {
      if (req.method !== 'GET') return fail(res, 405, 'Method not allowed')
      const user = await requireUser(req, res)
      if (!user) return undefined

      /* Keep the admin flag in sync with the ADMIN_EMAIL env variable */
      if (ADMIN_EMAIL && user.email === ADMIN_EMAIL && user.role !== 'admin') {
        await users.updateOne({ _id: user._id }, { $set: { role: 'admin' } })
        user.role = 'admin'
      }
      return sendJson(res, 200, { user: publicUser(user) })
    }

    /* ---------------- register ---------------- */
    if (action === 'register') {
      if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')
      const { name, email, password } = await readJson(req)
      const key = normEmail(email)

      if (!key || !key.includes('@')) {
        return fail(res, 400, "That email address doesn't look right.")
      }
      if (!password || String(password).length < 6) {
        return fail(res, 400, 'Password must be at least 6 characters long.')
      }

      const existing = await users.findOne({ email: key })
      if (existing) {
        return fail(
          res,
          409,
          'An account with this email already exists. Please sign in.',
        )
      }

      const doc = {
        name: String(name || '').trim() || key.split('@')[0],
        email: key,
        passwordHash: await hashPassword(password),
        role: ADMIN_EMAIL && key === ADMIN_EMAIL ? 'admin' : 'student',
        sub: null,
        watched: [],
        scores: {},
        createdAt: Date.now(),
      }

      let inserted
      try {
        inserted = await users.insertOne(doc)
      } catch (e) {
        if (e?.code === 11000) {
          return fail(
            res,
            409,
            'An account with this email already exists. Please sign in.',
          )
        }
        throw e
      }

      return sendJson(res, 201, {
        token: signToken(inserted.insertedId),
        user: publicUser({ ...doc, _id: inserted.insertedId }),
      })
    }

    /* ---------------- login ---------------- */
    if (action === 'login') {
      if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')
      const { email, password } = await readJson(req)
      const key = normEmail(email)

      const user = await users.findOne({ email: key })
      const ok = user && (await checkPassword(password, user.passwordHash))
      if (!ok) {
        return fail(res, 401, 'Incorrect email or password. Please try again.')
      }

      if (ADMIN_EMAIL && key === ADMIN_EMAIL && user.role !== 'admin') {
        await users.updateOne({ _id: user._id }, { $set: { role: 'admin' } })
        user.role = 'admin'
      }

      return sendJson(res, 200, {
        token: signToken(user._id),
        user: publicUser(user),
      })
    }

    /* ---------------- forgot password ---------------- */
    if (action === 'forgot-password') {
      if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')
      const { email, origin } = await readJson(req)
      const key = normEmail(email)
      if (!key || !key.includes('@')) {
        return fail(res, 400, "That email address doesn't look right.")
      }

      const user = await users.findOne({ email: key })

      /* Always answer the same way so the form can't be used to discover
         which email addresses have accounts. */
      if (user) {
        const token = randomToken()
        await db.collection('passwordResets').insertOne({
          email: key,
          tokenHash: sha256(token),
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + RESET_TTL_MS),
          used: false,
        })

        const base = String(origin || '').replace(/\/+$/, '')
        const link = `${base}/reset-password?token=${token}&email=${encodeURIComponent(key)}`

        try {
          const sent = await sendResetEmail(key, link)
          if (!sent) {
            console.warn(
              '[SAC Labs] SMTP is not configured, so no reset email was sent. ' +
                `Reset link for ${key}: ${link}`,
            )
          }
        } catch (e) {
          console.error('[SAC Labs] Could not send the reset email:', e)
        }
      }

      return sendJson(res, 200, { ok: true })
    }

    /* ---------------- reset password ---------------- */
    if (action === 'reset-password') {
      if (req.method !== 'POST') return fail(res, 405, 'Method not allowed')
      const { token, password } = await readJson(req)
      if (!token) return fail(res, 400, 'This reset link is not valid.')
      if (!password || String(password).length < 6) {
        return fail(res, 400, 'Password must be at least 6 characters long.')
      }

      const resets = db.collection('passwordResets')
      const record = await resets.findOne({ tokenHash: sha256(token), used: false })

      if (!record || new Date(record.expiresAt).getTime() < Date.now()) {
        return fail(
          res,
          400,
          'This reset link has expired or has already been used. Please request a new one.',
        )
      }

      await users.updateOne(
        { email: record.email },
        { $set: { passwordHash: await hashPassword(password) } },
      )
      await resets.updateOne({ _id: record._id }, { $set: { used: true } })

      return sendJson(res, 200, { ok: true })
    }

    return fail(res, 404, 'Unknown auth action.')
  } catch (e) {
    return serverError(res, e, `auth:${action}`)
  }
}
