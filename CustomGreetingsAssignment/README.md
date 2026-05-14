# Custom Greetings & Wishes App

A premium MERN stack application for creating personalized greeting cards with live previews and sharing capabilities.

## Features

- **Multi-method Authentication**: Google OAuth, Email/Password, and Guest login.
- **Profile Customization**: Users can upload a profile picture and set their name, which automatically overlays on greeting templates.
- **Template Library**: Categorized grid of templates (Birthday, Anniversary, Festivals).
- **Live Overlay Preview**: Instant visualization of the user's details on the selected template using CSS overlays.
- **Image Merging & Sharing**: High-quality canvas merging with a live preview and native sharing sheet (mobile) or direct download fallback (desktop).
- **Monetization**: Clear distinction between free and premium templates with a subscription upsell flow.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Framer Motion, Lucide React.
- **Backend**: Node.js, Express.
- **Database**: MongoDB with Mongoose.
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt for password hashing.
- **Image Processing**: HTML5 Canvas API.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a cloud URI)

### Installation
1. Clone the repository.
2. Run `npm run install:all` in the root directory to install dependencies for both client and server.
3. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/greetings-app
   JWT_SECRET=your_secret_key
   ```

### Running the App
1. Start both server and client:
   ```bash
   npm run dev
   ```
2. Seed the initial templates (while the server is running):
   ```bash
   npm run seed
   ```

## Usage
1. Open [http://localhost:5173](http://localhost:5173).
2. Login as a guest or create an account.
3. Set up your profile (Name and Photo).
4. Select a template and click "Merge & Share" to generate your custom greeting.
