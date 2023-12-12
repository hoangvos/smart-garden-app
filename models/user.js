const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  check:{
    type: Boolean,
    required: true
  },
  process:{
    type: Boolean,
    required: true
  }
});
module.exports = mongoose.model('User', userSchema);