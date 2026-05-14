const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'Guest' },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  profilePic: { type: String }, // Base64 or URL
  isPremium: { type: Boolean, default: false },
  authMethod: { type: String, enum: ['email', 'google', 'guest'], default: 'guest' },
  guestId: { type: String, unique: true, sparse: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
