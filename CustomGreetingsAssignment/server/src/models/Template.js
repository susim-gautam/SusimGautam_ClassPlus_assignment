const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  isPremium: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
