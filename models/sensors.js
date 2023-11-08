const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sensors = new Schema({
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  brightness_level:{
    type:Number,
    require: true
  }
});
module.exports = mongoose.model('sensors', sensors);