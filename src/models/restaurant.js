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
  menu: [new mongoose.Schema({
    name: String,
    description: String,
    price: {
      type: String,
      validate(value) {
        if(!validator.isCurrency(value)) {
          throw new Error('Please ensure price is in a valid currency')
        }
      }
    }
  })]
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant
