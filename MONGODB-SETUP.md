# SAC Labs — MongoDB setup

The site used to talk to Firebase directly from the browser. It now talks to a
small API of its own (the files in `/api`), and that API talks to MongoDB.

Nothing about the pages, the design or the features changed. Only the storage
layer underneath was swapped.

```
Browser  ->  /api/*  (Vercel serverless functions)  ->  MongoDB Atlas
```

The MongoDB password never reaches the browser, which is exactly why the API
layer had to be added: a database connection string is not safe to ship in
frontend code.

---

## 1. Create the database

1. Go to <https://www.mongodb.com/cloud/atlas> and create a free account.
2. Create a **free M0 cluster** (any region — Mumbai or Singapore is closest to
   Sri Lanka).
3. **Database Access** → *Add New Database User*. Pick a username and password
   and save them somewhere safe.
4. **Network Access** → *Add IP Address* → **Allow Access From Anywhere**
   (`0.0.0.0/0`). Vercel functions do not have fixed IP addresses, so this is
   required.
5. **Database** → *Connect* → *Drivers* → copy the connection string. It looks
   like:

   ```
   mongodb+srv://USERNAME:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

   Replace `<password>` with the real password and add the database name before
   the `?`:

   ```
   mongodb+srv://USERNAME:realpassword@cluster0.xxxxx.mongodb.net/saclabs?retryWrites=true&w=majority
   ```

   If the password contains `@`, `:`, `/` or `#`, URL-encode those characters
   (for example `@` becomes `%40`).

---

## 2. Create a session secret

Run this in a terminal and copy the output:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

This is the `JWT_SECRET`. It signs login sessions. Keep it private, and don't
change it later unless you're happy for everyone to be signed out.

---

## 3. Environment variables

Copy `.env.example` to `.env` and fill it in:

```bash
cp .env.example .env
```

| Variable | Required | What it is |
| --- | --- | --- |
| `MONGODB_URI` | yes | The connection string from step 1 |
| `MONGODB_DB` | yes | Database name, e.g. `saclabs` |
| `JWT_SECRET` | yes | The random string from step 2 |
| `ADMIN_EMAIL` | yes | The account that gets the Admin panel |
| `SMTP_*` | no | Only for "forgot password" emails — see below |

**These names must not start with `VITE_`.** Anything named `VITE_*` is compiled
into the browser bundle where anyone can read it. These stay server-side.

Add the exact same variables in Vercel:
**Project → Settings → Environment Variables** → add each one for
*Production*, *Preview* and *Development* → then **redeploy**.

---

## 4. Run it locally

The `/api` functions only run under Vercel's dev server, so use:

```bash
npm install
npm run dev:full
```

`npm run dev` starts Vite on its own. The pages load, but every `/api/...` call
answers with a "start it with vercel dev" message, because Vite cannot run
server code. Use `npm run dev:full` whenever you need login, the Admin panel or
anything else that touches the database.

The first `npm run dev:full` asks a few questions to link the folder to your
Vercel project — answer them once and it remembers.

---

## 5. First admin login

1. Open the site and register with the email you set as `ADMIN_EMAIL`.
2. That account is given the `admin` role automatically, and the Admin panel
   appears.

If you register first and set `ADMIN_EMAIL` afterwards, just sign out and back
in — the role is corrected on every login.

---

## Forgot-password emails (optional)

Firebase used to send these for us. To keep that working, add SMTP details to
your environment variables. With a Gmail account:

1. Turn on 2-Step Verification on the Google account.
2. Create an **App Password** (Google Account → Security → App passwords).
3. Set:

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=you@gmail.com
   SMTP_PASS=the-16-character-app-password
   SMTP_FROM="SAC Labs <you@gmail.com>"
   ```

Without these the page still works exactly the same for students — but no email
goes out. The reset link is printed in the Vercel function logs instead, so you
can send it manually. Setting up SMTP is strongly recommended.

---

## What lives where

| Collection | Holds |
| --- | --- |
| `users` | accounts, hashed passwords, subscription, watched sessions, quiz scores |
| `sessions` | video sessions added from the Admin panel |
| `papers` | paper entries added from the Admin panel |
| `quizzes` | quizzes built in the Admin panel |
| `grants` | manually granted access, keyed by email |
| `payRequests` | payment proofs submitted by students |
| `passwordResets` | one-time reset tokens (auto-deleted after 1 hour) |
| `paperFiles.*` | the uploaded PDFs themselves (GridFS) |

Indexes are created automatically the first time the API runs. There is nothing
to set up by hand.

---

## Things worth knowing

**PDF uploads are capped at 4 MB.** Vercel refuses request bodies larger than
4.5 MB, so the Admin form now rejects anything over 4 MB (it used to say 15 MB).
For bigger files, upload them somewhere else and link them, or move uploads to a
dedicated storage service later.

**The free Atlas tier gives you 512 MB.** PDFs stored in the database count
towards that. A few hundred small papers is fine; hundreds of large ones is not.

**Live updates are now polling.** Firestore pushed changes to every open tab
instantly. The app now re-checks every 20 seconds, whenever a tab regains focus,
and immediately after any change you make. In practice it feels the same.

**The session token is kept in `localStorage`.** It is signed and expires after
30 days. Signing out removes it.
