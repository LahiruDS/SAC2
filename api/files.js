import { ObjectId } from 'mongodb'
import {
  fail,
  readRaw,
  requireAdmin,
  sendJson,
  serverError,
} from './_lib/auth.js'
import { getBucket } from './_lib/db.js'

/*
 * Paper PDFs live in MongoDB itself, in a GridFS bucket called "paperFiles".
 *
 * Vercel refuses request bodies larger than 4.5 MB, so uploads are capped a
 * little below that.
 */
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

export default async function handler(req, res) {
  try {
    /* ---------------- download (public, like the old storage links) ------- */
    if (req.method === 'GET') {
      const id = String(req.query?.id || '')
      let _id
      try {
        _id = new ObjectId(id)
      } catch {
        return fail(res, 400, 'That file link is not valid.')
      }

      const bucket = await getBucket()
      const [file] = await bucket.find({ _id }).limit(1).toArray()
      if (!file) return fail(res, 404, 'That file no longer exists.')

      const name = (file.filename || 'paper.pdf').replace(/["\\]/g, '')
      res.setHeader('Content-Type', file.contentType || 'application/pdf')
      res.setHeader('Content-Length', String(file.length))
      res.setHeader('Content-Disposition', `inline; filename="${name}"`)
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

      const stream = bucket.openDownloadStream(_id)
      stream.on('error', (e) => {
        console.error('[SAC Labs API] file download:', e)
        res.end()
      })
      stream.pipe(res)
      return undefined
    }

    /* ---------------- upload (admin only) ---------------- */
    if (req.method === 'POST') {
      const admin = await requireAdmin(req, res)
      if (!admin) return undefined

      const filename = String(req.query?.name || 'paper.pdf').replace(
        /[^\w.-]+/g,
        '_',
      )

      const buffer = await readRaw(req)
      if (!buffer || buffer.length === 0) {
        return fail(res, 400, 'No file was received.')
      }
      if (buffer.length > MAX_UPLOAD_BYTES) {
        return fail(res, 413, 'PDF is too large — keep it under 4 MB.')
      }

      const bucket = await getBucket()
      const fileId = await new Promise((resolve, reject) => {
        const upload = bucket.openUploadStream(filename, {
          contentType: 'application/pdf',
          metadata: { uploadedBy: admin.email, uploadedAt: Date.now() },
        })
        upload.on('error', reject)
        upload.on('finish', () => resolve(upload.id))
        upload.end(buffer)
      })

      const id = String(fileId)
      return sendJson(res, 201, {
        fileId: id,
        url: `/api/files?id=${id}`,
        size: buffer.length,
      })
    }

    /* ---------------- delete (admin only) ---------------- */
    if (req.method === 'DELETE') {
      const admin = await requireAdmin(req, res)
      if (!admin) return undefined

      const id = String(req.query?.id || '')
      try {
        const bucket = await getBucket()
        await bucket.delete(new ObjectId(id))
      } catch {
        /* already gone — nothing to do */
      }
      return sendJson(res, 200, { ok: true })
    }

    return fail(res, 405, 'Method not allowed')
  } catch (e) {
    return serverError(res, e, 'files')
  }
}
