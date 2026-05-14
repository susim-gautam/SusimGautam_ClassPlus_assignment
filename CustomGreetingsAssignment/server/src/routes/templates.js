const express = require('express');
const router = express.Router();
const Template = require('../models/Template');

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Seed templates (utility for development)
router.post('/seed', async (req, res) => {
  const templates = [
    { title: 'Birthday Bash', category: 'Birthday', imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800', isPremium: false },
    { title: 'Elegant Wedding', category: 'Anniversary', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', isPremium: true },
    { title: 'Diwali Sparkle', category: 'Festival', imageUrl: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&q=80&w=800', isPremium: false },
    { title: 'Summer Greetings', category: 'Casual', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', isPremium: true },
    { title: 'Modern Anniversary', category: 'Anniversary', imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800', isPremium: false },
    { title: 'Party Time', category: 'Birthday', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800', isPremium: true }
  ];

  try {
    await Template.deleteMany({});
    await Template.insertMany(templates);
    res.json({ message: 'Templates seeded successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
