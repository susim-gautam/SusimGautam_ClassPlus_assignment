import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    authMethod: {
      type: String,
      enum: ['google', 'email', 'guest'],
      required: true,
    },
    email: { type: String, trim: true, lowercase: true, sparse: true, unique: true },
    passwordHash: { type: String },
    googleSub: { type: String, sparse: true, unique: true },
    displayName: { type: String, default: '' },
    photoDataUrl: { type: String, default: '' },
    profileConfigured: { type: Boolean, default: false },
    premiumUnlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
