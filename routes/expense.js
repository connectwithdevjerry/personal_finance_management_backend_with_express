const express = require('express');
const Expense = require('../models/Expense'); // Adjust the path as necessary
const auth = require('../middleware/auth');
const user = require('../models/User')

const router = express.Router();

// GET all expenses for the logged-in user
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new expense
router.post('/', async (req, res) => {
  console.log("now in saving expense");
  const { category, date, amount, userId } = req.body;
  user.findOne({_id:userId}).then( async(currentUser)=>{
    console.log(amount, currentUser.balance)
    if(currentUser.balance==0){
      res.send({status:false, message:"Insuffiecient Funds"})
    }else if(amount>currentUser.balance){
    
      res.send({status:false, message:"Insuffiecient Funds" })
      console.log("ddd")
    }else if(currentUser.balance>amount){
      const newExpense = new Expense({
        category,
        date,
        amount,
        userId,
      });
      console.log("Received data:", req.body);
      try {
        currentUser.balance= currentUser.balance-amount
        currentUser.save()
        console.log(currentUser)
        const savedExpense = await newExpense.save();
        if (savedExpense) {
          res.send({ status: true, message: "Expense saved successfully" });
        } else {
          res.send({ status: false, message: "Error: Unable to save expense" });
        }
      } catch (err) {
        res.status(400).json({ message: err.message });
      }     
    }
  }).catch(err=>{
    console.log(err)
  })
 
});

// Fetch user expenses
router.post('/fetchexpense', async (req, res) => {
  const { currentUser } = req.body;

  try {
    const getUserExpense = await Expense.find({ userId: currentUser });
    // console.log("Fetched user expenses:", getUserExpense);
    res.json(getUserExpense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE an expense
router.post('/delete', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.body.expenseid });
    if (expense) {
      return res.status(200).json({ message: 'Expense deleted' });
    }else{
      res.json({ message: 'Expense not found or deleted' });
    }
    // await expense.remove();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
