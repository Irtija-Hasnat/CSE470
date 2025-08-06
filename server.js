const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Trip = require('./models/Trip');
require('dotenv').config();



const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json()); 





mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch((err) => console.error(' MongoDB connection error:', err));


app.listen(5000, () => console.log('🚀 Backend running on port 5000'));

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role, vehicleType } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, vehicleType });
    res.status(201).json(user);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Incorrect password' });

  res.json(user);
});

// Create Trip
app.post('/api/trips', async (req, res) => {
  const { passengerId, driverId, earnings } = req.body;
  const trip = await Trip.create({ passengerId, driverId, earnings });
  res.json(trip);
});

// Get User Trips
app.get('/api/trips/:userId', async (req, res) => {
  const { userId } = req.params;
  const trips = await Trip.find({ $or: [{ driverId: userId }, { passengerId: userId }] })
    .populate('driverId passengerId');
  res.json(trips);
});

// Change Trip Status
app.put('/api/trips/:id/status', async (req, res) => {
  const { status } = req.body;
  const trip = await Trip.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(trip);
});

// Rate/Comment Trip
app.put('/api/trips/:id/rate', async (req, res) => {
  const { rating, comment } = req.body;
  const trip = await Trip.findByIdAndUpdate(req.params.id, { rating, comment }, { new: true });
  res.json(trip);
});


