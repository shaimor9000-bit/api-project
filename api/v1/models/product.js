const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  pid: { type: Number, unique: true, index: true },
  price: Number,
  bname: String,
  bauthor: String,
  bcategory: String,
  pages: Number,
  isBorrowed: { type: Boolean, default: false },
  borrowedAt: { type: Date, default: null }
});

module.exports = mongoose.model('products', Schema);