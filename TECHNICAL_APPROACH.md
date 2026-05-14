# Technical approach — MERN Custom Greetings App

## Architecture

The app follows a classic **MERN** split:

1. **MongoDB** stores `User` documents (authentication fields, profile text, base64/JPEG photo payload, `profileConfigured`, `premiumUnlocked`).
2. **Express** on **Node.js** implements REST endpoints for registration, login, guest creation, Google token verification, authenticated profile updates, premium toggling, and a static template catalog.
3. **React** (Vite) renders the UI, calls the API with `Authorization: Bearer <JWT>`, and keeps the JWT in `localStorage`.

## Image overlay and sharing (client)

Live grid previews use **CSS-layered overlays** (`OverlayPreview`) for performance. **Share** still uses a **canvas** pipeline (`mergeGreetingImage`) to flatten background + circular avatar + stroked text into a single PNG, then **`navigator.share`** when supported, otherwise **download**.

## Auth details

- **Email:** bcrypt-hashed passwords, unique email index.
- **Guest:** anonymous `User` rows with `authMethod: 'guest'`.
- **Google:** `@react-oauth/google` obtains an ID token; the server verifies it with `google-auth-library` using `GOOGLE_CLIENT_ID`. Returning users keep `profileConfigured` so they are not forced through onboarding again.
- **Google demo:** When the SPA has no `VITE_GOOGLE_CLIENT_ID`, it calls `POST /api/auth/google-demo` (gated by `ALLOW_GOOGLE_DEMO`) so reviewers can still click a Google-like path without OAuth setup.

## Tech stack table

| Area | Technology |
| --- | --- |
| Database | MongoDB + Mongoose |
| API | Express 4, `cors`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `google-auth-library` |
| Client | React 19, TypeScript, Vite 8, `react-router-dom` |
| Dev orchestration | `concurrently` at repo root |

## Challenges

- **Canvas + remote images:** Backgrounds use CORS-friendly URLs; avatars are normalized to data URLs on profile save when needed.
- **JWT + SPA:** Bearer tokens are simple for the assignment; production would prefer httpOnly cookies and refresh rotation.
- **Large profile photos:** The API rejects oversized base64 payloads to protect MongoDB document size.

## Future work

- Move media to object storage (S3/GCS) instead of inline base64.
- Refresh tokens, email verification, and real payment provider for premium.
- Server-side rendering or CDN deployment for the React bundle.
