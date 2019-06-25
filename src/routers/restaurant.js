const express = require('express')
const Restaurant = require('../models/restaurant')
const router = new express.Router()

router.post('/restaurants', async (req, res) => {
  const restaurant = new Restaurant(req.body)

  try {
    await restaurant.save()
    res.status(201).send(restaurant)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
