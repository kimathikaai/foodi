const mongoose = require('mongoose')
const validator = require('validator')

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  website: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if(!validator.isURL(value)) {
        throw new Error('Website URL is invalid')
      }
    }
  },
  menu: {
    type: [{
      name: String,
      description: String,
      price: Number
    }],
    required: true
    //need to add validator to ensure the price is a valid dollar value
  }
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant
