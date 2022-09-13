const mongoose = require('mongoose')

const AttractionSchema = new mongoose.Schema({
  attraction: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    required: false,
  },
  userId: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  hours: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
})

module.exports = mongoose.model('Attraction', AttractionSchema)