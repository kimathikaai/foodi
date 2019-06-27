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

const upload = multer({
  limits: {
    fileSize: 2000000 // 2MB file size limit
  },
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image.'))
    }

    cb(undefined, true)
  }
})

router.post('/restaurants/:id/picture', userAuth, upload.single('picture'), async (req, res) => {
  const buffer = sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    const isAdmin = restaurant.verifyAdmin(req.user)

    if(!isAdmin) {
      throw new Error('You are not an admin')
    }

    restaurant.picture = buffer
    await restaurant.save()
    res.status(200).send()
  } catch(error) {
    res.status(500).send()
  }
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.delete('/restaurants/:id/picture', userAuth, async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id)
      const isAdmin = restaurant.verifyAdmin(req.user)

      if(!isAdmin) {
        throw new Error('You are not an admin')
      }

      restaurant.picture = undefined
      await restaurant.save()
      res.send(restaurant)
    } catch(error) {
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
