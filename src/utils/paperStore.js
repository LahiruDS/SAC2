import { api, apiUpload } from '../lib/api'

/*
 * Paper PDFs are stored inside MongoDB (GridFS) through the /api/files route.
 *
 * Vercel rejects request bodies over 4.5 MB, so uploads are capped at 4 MB.
 */
export const MAX_PAPER_BYTES = 4 * 1024 * 1024

/**
 * Uploads a paper PDF and returns { key, filePath, url } — the same shape the
 * old Firebase Storage helper returned, so the Admin page needs no changes.
 */
export async function savePaperFile(key, file) {
  const safeName = (file.name || 'paper.pdf').replace(/[^\w.-]+/g, '_')
  const res = await apiUpload(
    `/api/files?name=${encodeURIComponent(safeName)}`,
    file,
  )
  return {
    key,
    filePath: res.fileId,
    fileId: res.fileId,
    url: res.url,
  }
}

export async function deletePaperFile(fileId) {
  if (!fileId) return
  try {
    await api(`/api/files?id=${encodeURIComponent(fileId)}`, {
      method: 'DELETE',
    })
  } catch {
    /* ignore */
  }
}

export function humanFileSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
