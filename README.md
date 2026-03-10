# ChatGPT Chapter Saver (Next.js + Chrome Extension)

A full-stack app to save ChatGPT Q&A into chapter-based notes and export chapters as PDF.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- NextAuth (email/password credentials)
- PDFKit for server-side PDF export
- Chrome extension (Manifest V3)

## Project structure
- `app/` - UI pages and API routes
- `lib/` - Prisma and NextAuth config
- `prisma/schema.prisma` - DB models
- `extension/` - Chrome extension code

## Setup
1. Install deps:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. Set auth envs:
   ```bash
   # Generate a strong NEXTAUTH_SECRET
   openssl rand -base64 32
   ```
   Put the output into `NEXTAUTH_SECRET` in `.env`.
4. Generate Prisma client and migrate:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
5. Start app:
   ```bash
   npm run dev
   ```

## How to find / set NextAuth keys
For this project (credentials auth), you mainly need:
- `NEXTAUTH_SECRET`: random secret used by NextAuth to sign/encrypt tokens.
- `NEXTAUTH_URL`: your app URL (local: `http://localhost:3000`, production: your Vercel URL).

Useful commands:
```bash
# option 1: openssl
openssl rand -base64 32

# option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Where to configure:
- Local: `.env`
- Vercel: Project → Settings → Environment Variables (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DATABASE_URL`)

If you later add OAuth providers, you will also need provider keys (for example Google):
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
These are created in the provider developer console and then added as environment variables.


## Next.js build fix for `/api/auth/[...nextauth]`
If Vercel build fails with:
`Failed to collect page data for /api/auth/[...nextauth]`
this project now forces the NextAuth route to run dynamically on Node runtime (`dynamic = 'force-dynamic'`, `runtime = 'nodejs'`) to prevent static data collection for auth handlers.

Also set these environment variables in Vercel before building:
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `DATABASE_URL`

## Vercel build fix for `iconv-lite` / `fontkit`
If Vercel build fails with:
`Module not found: Can't resolve 'iconv-lite' in .../node_modules/fontkit`
this repo now includes `iconv-lite` in dependencies. Re-run install/build:
```bash
npm install
npm run build
```

## API routes
- `POST /api/auth` register user
- `POST /api/chapter` create chapter
- `GET /api/chapters` list chapters
- `POST /api/conversation` save conversation
- `GET /api/conversations` list/search conversations
- `GET /api/export/pdf?chapterId=...` download chapter PDF

## Extension
Load the `extension/` folder in Chrome using **Load unpacked**.

- `content.js`: injects Save button under ChatGPT responses
- `popup.html` / `popup.js`: chapter/title/notes form + API calls
- `background.js`: stores captured payload between content and popup

## Deployment
Deploy the Next.js app to Vercel. Configure `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` in Vercel environment variables and run Prisma migrations against your PostgreSQL instance.
