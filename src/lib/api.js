/*
 * Small client for the SAC Labs API (the serverless functions in /api).
 *
 * This file replaces the old Firebase SDK setup. Nothing secret lives here —
 * the MongoDB connection string stays on the server, and the browser only ever
 * holds a signed session token.
 */

const TOKEN_KEY = 'saclabs.token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* private browsing mode — the session just won't survive a refresh */
  }
}

export function clearToken() {
  setToken('')
}

/* Rejects with { code: 'timeout' } if the request takes longer than ms */
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject({ code: 'timeout' }), ms),
    ),
  ])
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/*
 * Calls the API. `path` is relative, e.g. "/api/content".
 * Throws an ApiError with a human-readable message when something goes wrong.
 */
export async function api(path, { method = 'GET', body, timeout = 20000 } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let payload
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let res
  try {
    res = await withTimeout(
      fetch(path, { method, headers, body: payload }),
      timeout,
    )
  } catch (e) {
    if (e?.code === 'timeout') {
      throw new ApiError(
        'This is taking too long — check your internet connection and try again.',
        0,
      )
    }
    throw new ApiError(
      'Network problem — check your internet connection and try again.',
      0,
    )
  }

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    throw new ApiError(
      data?.error || 'Something went wrong. Please try again.',
      res.status,
    )
  }

  return data || {}
}

/* Uploads a PDF as a raw body (no extra multipart dependency needed) */
export async function apiUpload(path, file, { timeout = 60000 } = {}) {
  const headers = { 'Content-Type': 'application/pdf' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await withTimeout(
      fetch(path, { method: 'POST', headers, body: file }),
      timeout,
    )
  } catch {
    throw new ApiError('The upload failed. Please try again.', 0)
  }

  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }

  if (!res.ok) {
    throw new ApiError(data?.error || 'The upload failed.', res.status)
  }
  return data
}
