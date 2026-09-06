import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { getDb } from './db.js'

const JWT_SECRET = process.env.JWT_SECRET || ''
const TOKEN_DAYS = 30

export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '')
  .trim()
  .toLowerCase()

export function normEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export async function hashPassword(password) {
  return bcrypt.hash(String(password), 10)
}

export async function checkPassword(password, hash) {
  if (!hash) return false
  return bcrypt.compare(String(password), hash)
}

export function signToken(userId) {
  if (!JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is not set. Add a long random string to your environment ' +
        'variables (both locally in .env and in the Vercel dashboard).',
    )
  }
  return jwt.sign({ uid: String(userId) }, JWT_SECRET, {
    expiresIn: `${TOKEN_DAYS}d`,
  })
}

export function verifyToken(token) {
  if (!JWT_SECRET || !token) return null
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

/* Reads "Authorization: Bearer <token>" and returns the users document, or null */
export async function getUserFromRequest(req) {
  const header = req.headers?.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  const payload = verifyToken(token)
  if (!payload?.uid) return null

  let _id
  try {
    _id = new ObjectId(String(payload.uid))
  } catch {
    return null
  }

  const db = await getDb()
  const user = await db.collection('users').findOne({ _id })
  return user || null
}

/* Shape a users document for the browser (never leak the password hash) */
export function publicUser(doc) {
  if (!doc) return null
  return {
    id: String(doc._id),
    name: doc.name || '',
    email: doc.email || '',
    role: doc.role || 'student',
    sub: doc.sub || null,
    watched: doc.watched || [],
    scores: doc.scores || {},
    createdAt: doc.createdAt || null,
  }
}

/* Admin users listing — no password hashes, no personal progress data */
export function publicListedUser(doc) {
  return {
    name: doc.name || '',
    email: doc.email || '',
    role: doc.role || 'student',
    createdAt: doc.createdAt || null,
  }
}

export function randomToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex')
}

/* ---------- small HTTP helpers ---------- */

export function sendJson(res, status, body) {
  res.status(status)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

export function fail(res, status, message) {
  return sendJson(res, status, { error: message })
}

/* Turns an unexpected server error into a message that is safe to display */
export function serverError(res, e, label) {
  console.error(`[SAC Labs API] ${label}:`, e)
  const msg = String(e?.message || '')
  if (msg.includes('MONGODB_URI') || msg.includes('JWT_SECRET')) {
    return fail(res, 503, msg)
  }
  if (msg.includes('ENOTFOUND') || msg.includes('ETIMEDOUT') || msg.includes('ServerSelection')) {
    return fail(
      res,
      503,
      'Could not reach the database. Check your MongoDB connection string and ' +
        'that your Atlas Network Access allows connections from anywhere.',
    )
  }
  return fail(res, 500, 'Something went wrong on the server. Please try again.')
}

/* Reads a JSON body whether or not the platform already parsed it */
export async function readJson(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body
  }
  const raw = await readRaw(req)
  if (!raw || raw.length === 0) return {}
  try {
    return JSON.parse(raw.toString('utf8'))
  } catch {
    return {}
  }
}

/* Reads the raw request body as a Buffer */
export async function readRaw(req) {
  if (Buffer.isBuffer(req.body)) return req.body
  if (typeof req.body === 'string') return Buffer.from(req.body)

  const chunks = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

/* Guard helpers — return the user, or send the error response and return null */
export async function requireUser(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) {
    fail(res, 401, 'Please sign in to continue.')
    return null
  }
  return user
}

export async function requireAdmin(req, res) {
  const user = await getUserFromRequest(req)
  if (!user) {
    fail(res, 401, 'Please sign in to continue.')
    return null
  }
  if ((user.role || 'student') !== 'admin') {
    fail(res, 403, 'This action is for the SAC Labs admin only.')
    return null
  }
  return user
}
