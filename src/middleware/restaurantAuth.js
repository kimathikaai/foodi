const userAuth = require('./userAuth')
const Restaurant = require('../models/restaurant')

const auth = async (req, res, next) => {
  await userAuth()
  const restaurant = req.restaurant
  
}

module.exports = auth
