import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function Papers() {
  const { hasFullAccess, customPapers } = useAuth()
  const [toast, setToast] = useState(null)
  const [busyId, setBusyId] = useState(null)

  // Only show papers uploaded by Teacher/Admin
  const allPapers = customPapers || []
  const unlocked = hasFullAccess()

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const handleDownload = (paper) => {
    if (!unlocked) {
      showToast(
        'Subscribe (or get teacher approval) to unlock paper downloads'
      )
      return
    }

    if (!paper.fileUrl) {
      showToast(
        'No PDF uploaded yet. Ask your teacher to upload it.'
      )
      return
    }

    try {
      setBusyId(paper.id)

      const a = document.createElement('a')
      a.href = paper.fileUrl
      a.download = paper.fileName || `${paper.title}.pdf`
      a.target = '_blank'
      a.rel = 'noopener'

      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch {
      showToast('Could not open the PDF file.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="section">
      <div className="container">

        {/* Header */}
        <div className="center">
          <span className="eyebrow">Resources</span>

          <h2 className="h2">
            Past papers, question banks & notes
          </h2>

          <p className="sub sub-center mt-1">
            Download and practise with real exam papers and
            teacher-prepared notes.
            {!unlocked && ' Subscribe to unlock downloads.'}
          </p>
        </div>

        {/* Papers */}
        {allPapers.length > 0 ? (
          <div className="grid-2 mt-4">

            {allPapers.map((paper) => (
              <div
                className="card paper-card"
                key={paper.id}
              >

                {/* File Icon */}
                <span
                  className="paper-icon"
                  style={{
                    background:
                      paper.color || 'var(--primary)',
                  }}
                >
                  <FileText size={26} />
                </span>

                {/* Paper Information */}
                <div style={{ flex: 1 }}>

                  <h3 style={{ fontSize: '1.02rem' }}>
                    {paper.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--muted)',
                    }}
                  >
                    {paper.subject || 'Chemistry'}
                    {' · '}
                    {paper.type || 'Past Paper'}

                    {paper.fileName && ' · PDF'}
                  </p>

                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--muted)',
                      marginTop: 4,
                    }}
                  >
                    {paper.pages || '-'} pages
                    {' · '}
                    {paper.size || '-'}
                  </p>

                </div>

                {/* Download Button */}
                <button
                  className="btn btn-sm"
                  disabled={busyId === paper.id}
                  style={{
                    background: unlocked
                      ? 'var(--grad)'
                      : '#f1eefc',

                    color: unlocked
                      ? '#fff'
                      : 'var(--primary-dark)',
                  }}
                  onClick={() => handleDownload(paper)}
                >
                  <Download size={15} />

                  {busyId === paper.id
                    ? 'Opening…'
                    : unlocked
                    ? 'Download'
                    : 'Locked'}
                </button>

              </div>
            ))}

          </div>
        ) : (

          /* No Papers Message */
          <div
            className="card"
            style={{
              marginTop: '2rem',
              textAlign: 'center',
              padding: '3rem 1.5rem',
            }}
          >
            <FileText
              size={45}
              style={{
                opacity: 0.35,
                marginBottom: '1rem',
              }}
            />

            <h3>
              No papers available yet
            </h3>

            <p
              style={{
                color: 'var(--muted)',
                marginTop: '0.5rem',
              }}
            >
              Teacher-uploaded papers will appear here.
            </p>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="toast">
            {toast}
          </div>
        )}

      </div>
    </section>
  )
}