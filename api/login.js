const express = require('express');
const Product = require('../model/login'); // Adjust the path if necessary
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Set up CORS
app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.options('*', cors()); // This handles preflight requests

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB connection
mongoose.connect("mongodb+srv://Dev:Devpatel123@cluster0.w7lmtlf.mongodb.net")
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log('MongoDB connection error: ' + err));

// CREATE a new user login
app.post('/api/login', async (req, res) => {
    try {
        const { userid, mailid, username, password } = req.body;

        // Validate if the required fields are provided
        if (!userid || !mailid || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await Product.findOne({ $or: [{ userid }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with the same userid or username already exists' });
        }

        const newUser = new Product({ userid, mailid, username, password });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ all users
app.get('/api/login', async (req, res) => {
    try {
        const users = await Product.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ a single user by ID
app.get('/api/login/:id', async (req, res) => {
    try {
        const user = await Product.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE a user by ID
app.put('/api/login/:id', async (req, res) => {
    try {
        const updatedUser = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a user by ID
app.delete('/api/login/:id', async (req, res) => {
    try {
        const deletedUser = await Product.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE all users (optional)
app.delete('/api/login', async (req, res) => {
    try {
        await Product.deleteMany({});
        res.status(200).json({ message: 'All users deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Handle OPTIONS requests (CORS preflight)
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

// Set the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
