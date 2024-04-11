// models/budgetAndGoal.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  amountb: {
    type: Number,
    required: true,
  },
  amounts: {
    type: Number,
    required: true,
  },
  userId: {
    type:String,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('budget', budgetSchema);
