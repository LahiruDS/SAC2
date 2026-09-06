import { COURSES } from './saclabsData'

export function findCourse(id) {
  return COURSES.find((c) => c.id === id) || null
}

export function findSession(course, sessionId) {
  if (!course) return null
  for (const m of course.modules) {
    const found = m.sessions.find((s) => s.id === sessionId)
    if (found) return found
  }
  return null
}

export function allSessions(course, extraSessions = []) {
  if (!course) return []
  const base = course.modules.flatMap((m) => m.sessions)
  const extras = (extraSessions || []).map((s) => s.session)
  return [...base, ...extras]
}

export function findSessionAny(course, sessionId, extraSessions = []) {
  const fromCourse = findSession(course, sessionId)
  if (fromCourse) return fromCourse
  const extras = (extraSessions || []).map((s) => s.session)
  return extras.find((s) => s.id === sessionId) || null
}
