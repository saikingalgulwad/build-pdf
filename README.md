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
3. Generate Prisma client and migrate:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
4. Start app:
   ```bash
   npm run dev
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
