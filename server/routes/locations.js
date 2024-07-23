const express = require('express');
const Location = require('../models/Location');
const router = express.Router();

router.get('/', async (req, res) => {
  const locations = await Location.find();
  res.json(locations);
});

router.post('/', async (req, res) => {
  const { name, coordinates, visitDate } = req.body;
  const location = new Location({ name, coordinates, visitDate });
  await location.save();

  const io = req.app.get('socketio');
  
  // 计算提醒时间
  const now = new Date();
  const visitTime = new Date(visitDate);
  const delay = visitTime - now;

  if (delay > 0) {
    setTimeout(() => {
      io.emit('reminder', { message: `It's time to visit ${name}` });
    }, delay);
  }

  res.status(201).json(location);
});

router.put('/:id', async (req, res) => {
  const { name, coordinates, visitDate } = req.body;
  const location = await Location.findById(req.params.id);
  if (!location) {
    return res.status(404).json({ message: 'Location not found' });
  }
  location.name = name;
  location.coordinates = coordinates;
  location.visitDate = visitDate;
  await location.save();
  res.json(location);
});

router.delete('/:id', async (req, res) => {
  const location = await Location.findById(req.params.id);
  if (!location) {
    return res.status(404).json({ message: 'Location not found' });
  }
  await Location.deleteOne({ _id: req.params.id });
  res.json({ message: 'Location removed' });
});

module.exports = router;