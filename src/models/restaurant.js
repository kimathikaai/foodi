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
  })],
  picture: {
    type: Buffer
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

restaurantSchema.methods.verifyAdmin = function(user) {
  const restaurant = this

  var isAdmin = restaurant.admins.some(adminId => adminId.equals(user._id))

  return isAdmin
}

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant
