# Technical Approach Document

This document explains the implementation details and technical decisions for the Custom Greetings & Wishes App.

## Problem Solving Approach

### Image Overlay Logic
One of the core requirements was a live preview of user data over background templates.
- **Frontend Preview**: To ensure performance and responsiveness, the live preview uses **CSS Absolute Positioning** and **Flexbox** over the template image. This allows instant updates as the user changes their name or photo without heavy processing.
- **Image Merging (The 'Flatten' Logic)**: For sharing, we need a single image file. This is implemented using the **HTML5 Canvas API**. 
  - The template image is drawn first.
  - The user's profile picture is drawn in a circular clipped path.
  - The name is rendered with custom typography and shadow for readability.
  - The final state is exported via `canvas.toDataURL()` or `canvas.toBlob()`.

### Tech Stack Rationale
- **MERN Stack**: Chosen for its seamless JSON integration and rapid development capabilities. MongoDB's flexible schema handles varying user profile data and template metadata efficiently.
- **Vite + TypeScript**: Provides a modern developer experience with type safety, which is crucial for handling complex UI states like image merging.
- **Glassmorphism UI**: Implemented via CSS `backdrop-filter: blur()` and semi-transparent backgrounds to give a premium, modern feel.

## Challenges & Solutions

### Challenge 1: Cross-Origin Images in Canvas
**Problem**: Drawing images from external URLs (like Unsplash) onto a canvas "taints" it, preventing data export (`toDataURL`).
**Solution**: Set `img.crossOrigin = "anonymous"` and ensured the template URLs support CORS headers.

### Challenge 2: Mobile Sharing
**Problem**: Standard downloads don't always feel "native" on mobile.
**Solution**: Implemented the **Web Share API** (`navigator.share`) to trigger the native device share sheet (WhatsApp, Instagram, etc.), falling back to a download link on desktop browsers.

## Future Improvements

### 1. Cloud Media Storage
Currently, user profile photos are handled as Base64 strings in MongoDB for simplicity. For production, these should be uploaded to **AWS S3** or **Cloudinary**, and only URLs should be stored in the database.

### 2. Advanced Customization
Allowing users to move and resize the overlays manually, and choose different font styles/colors.

### 3. Real Payments
Integrating **Stripe** or **Razorpay** for the premium subscription instead of a mock popup.
