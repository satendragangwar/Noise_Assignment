const express = require('express');
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const cors = require('cors'); 
const jwt = require('jsonwebtoken');
const User = require('./model/User');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;


app.use(cors());
app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URL, {  // Replace with your MongoDB URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));




const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
});

const Expense = mongoose.model('Expense', expenseSchema);


app.post('/expenses', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense); 
    } catch (err) {
        res.status(400).json({ message: err.message }); 
    }
});



app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        
        const token = jwt.sign({ _id: user._id }, 'your_secret_key'); 
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/expenses', async (req, res) => {
    try {
        let query = {};

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.date) {
            query.date = new Date(req.query.date);
        }
        const expenses = await Expense.find(query);
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/expenses/:id', async (req, res) => {
    try {
        const expenseId = req.params.id;
        const deletedExpense = await Expense.findByIdAndDelete(expenseId);

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get('/expenses/total', async (req, res) => {
    try {
        const startDate = new Date(req.query.start);
        const endDate = new Date(req.query.end);

        const expenses = await Expense.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        });

        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        res.json({ total: totalExpenses });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});