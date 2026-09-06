import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/*
 * The /api folder holds Vercel serverless functions. They run on the server
 * with Node, not in the browser, so Vite must never try to bundle them.
 *
 * If the plain Vite dev server is used, requests to /api have nothing to
 * answer them, so this plugin replies with a clear message instead of letting
 * Vite try to load the function file as browser code.
 */
function apiNotAvailableInVite() {
  return {
    name: 'saclabs:api-needs-vercel-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) return next()
        res.statusCode = 503
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            error:
              'The API is not running. Start the site with "vercel dev" ' +
              'instead of "vite" so the /api functions are served too.',
          }),
        )
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [apiNotAvailableInVite(), react()],
  /* Never crawl the serverless functions when pre-bundling dependencies */
  optimizeDeps: {
    entries: ['index.html', 'src/**/*.{js,jsx}'],
    exclude: ['mongodb', 'bcryptjs', 'jsonwebtoken', 'nodemailer'],
  },
  server: {
    watch: { ignored: ['**/api/**'] },
  },
})
