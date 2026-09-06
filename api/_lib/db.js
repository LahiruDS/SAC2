import { MongoClient, GridFSBucket } from 'mongodb'

/*
 * MongoDB connection helper.
 *
 * Serverless functions can be started and stopped many times, so we cache the
 * client on the global object. That way warm invocations reuse the same
 * connection pool instead of opening a new one on every request.
 */

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'saclabs'

export const dbConfigured = Boolean(uri)

let cached = globalThis.__saclabsMongo
if (!cached) {
  cached = globalThis.__saclabsMongo = { client: null, promise: null }
}

export async function getDb() {
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Add it to your .env file (local) and to the ' +
        'Vercel project Environment Variables (production).',
    )
  }

  if (!cached.promise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    })
    cached.promise = client.connect().then((c) => {
      cached.client = c
      return c
    })
  }

  const client = await cached.promise
  return client.db(dbName)
}

/* GridFS bucket used to store uploaded paper PDFs inside MongoDB */
export async function getBucket() {
  const db = await getDb()
  return new GridFSBucket(db, { bucketName: 'paperFiles' })
}

/* Creates the indexes the app relies on. Safe to call on every request. */
let indexesReady = null
export async function ensureIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb()
      await Promise.all([
        db.collection('users').createIndex({ email: 1 }, { unique: true }),
        db.collection('papers').createIndex({ createdAt: -1 }),
        db.collection('payRequests').createIndex({ requestedAt: -1 }),
        db.collection('payRequests').createIndex({ email: 1 }),
        db
          .collection('passwordResets')
          .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      ])
    })().catch((e) => {
      /* Don't cache a failure — let the next request try again */
      indexesReady = null
      throw e
    })
  }
  return indexesReady
}
