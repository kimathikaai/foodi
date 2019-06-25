const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    const token = await user.generateAuthToken()
    await user.save()
    res.status(201).send({ user, token })
  } catch(error) {
    res.status(400).send(error)
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch(error) {
    res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token
      })

    await req.user.save()

    res.send()
  } catch(error) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch(error) {
    res.status(500).send()
  }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if(!isValidOperation) {
    return res.status(400).send({ error: 'Invalid update.' })
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch(error) {
    res.status(400).send(error)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch(error) {
    res.status(500).send(error)
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

router.post('/users/me/picture', auth, upload.single('picture'), async (req, res) => {
  req.user.picture = req.file.buffer
  await req.user.save()
  res.status(200).send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.delete('/users/me/picture', auth, async (req, res) => {
    req.user.picture = undefined
    await req.user.save()
    res.send(req.user)
})

router.get('/users/:id/picture', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if(!user || !user.picture) {
      throw new Error()
    }

    res.set('Content-Type', 'image/jpg')
    res.send(user.picture)
  } catch(error) {
    res.status(404).send()
  }
})

module.exports = router
