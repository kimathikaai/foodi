const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Restaurant = require('../models/restaurant')
const auth = require('../middleware/auth')
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

router.delete('/restaurants/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    const isAdmin = await restaurant.verifyAdmin(req.user)

    if(!isAdmin) {
      throw new Error('You are not an admin')
    }

    await restaurant.remove()
    res.send(restaurant)
  } catch (error) {
    res.status(500).send()
  }
})

router.get('/restaurants/:id/picture', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)

    if(!restaurant || !restaurant.picture) {
      throw new Error()
    }

    res.set('Content-Type', 'image/jpg')
    res.send(restaurant.picture)
  } catch(error) {
    res.status(404).send()
  }
})

module.exports = router
