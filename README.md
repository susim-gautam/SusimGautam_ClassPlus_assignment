# Custom Greetings & Wishes — MERN stack

This project implements the PRD using **MongoDB**, **Express**, **React** (Vite), and **Node.js**:

- **MongoDB + Mongoose** persist users (auth method, email, hashed password, Google subject id, profile fields, premium flag).
- **Express** exposes JSON REST APIs under `/api`.
- **React** is the client; in development, **Vite proxies** `/api` to the Express server.
- **JWT** bearer tokens are returned on sign-in and stored in `localStorage` for subsequent API calls.

## Prerequisites

- **MongoDB** running locally or a cloud connection string (`MONGO_URI`).
- **Node.js** 20+ recommended for Vite 8 (warnings may appear on Node 18).

## One-time setup

From the repository root:

```bash
npm install
npm run install:all
```

### Server environment

```bash
copy server\.env.example server\.env
```

Edit `server/.env`:

- `MONGO_URI` — e.g. `mongodb://127.0.0.1:27017/custom-greetings`
- `JWT_SECRET` — long random string
- `GOOGLE_CLIENT_ID` — optional; **must match** `VITE_GOOGLE_CLIENT_ID` on the client when using real Google sign-in
- `ALLOW_GOOGLE_DEMO` — default `true`; enables `POST /api/auth/google-demo` when the client has no Google client id

### Client environment (optional)

```bash
copy web\.env.example web\.env
```

Set `VITE_GOOGLE_CLIENT_ID` for real Google. Leave `VITE_API_URL` empty in dev so requests go to `/api` and the Vite proxy forwards to Express.

## Run (development)

Start **MongoDB**, then from the repo root:

```bash
npm run dev
```

This runs **Express** (`http://127.0.0.1:5000`) and **Vite** (`http://localhost:5173`) together.

Open the Vite URL in the browser. Use **Register** / **Sign in** / **Guest** / **Google (demo or real)**.

## Production-style commands

```bash
npm run build:web
npm run start
```

Serve the built React app with a static host or CDN, and point `VITE_API_URL` (at build time) to your public API origin. Configure CORS on Express for that origin.

## API summary

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Email + password |
| POST | `/api/auth/login` | Email + password |
| POST | `/api/auth/guest` | New guest user |
| POST | `/api/auth/google` | `{ idToken }` — verified with Google |
| POST | `/api/auth/google-demo` | Demo Google user (when allowed) |
| GET | `/api/me` | Current user (Bearer JWT) |
| PATCH | `/api/me/profile` | `{ displayName, photoDataUrl }` |
| PATCH | `/api/me/premium` | `{ premiumUnlocked }` |
| GET | `/api/templates` | Template catalog |

## Submission (PRD)

- Push to a public Git host and share the link.
- Record the demo video (login → home → premium → profile personalization → share).
- See `TECHNICAL_APPROACH.md` for the written technical approach.

The original PRD PDF remains in the repo root.
