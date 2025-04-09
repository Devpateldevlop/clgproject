const express = require('express');
const Product = require('../model/listed'); // Adjust the path if necessary
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // Required for file uploads
const Grid = require('gridfs-stream'); 
// Express app setup
const app = express();

// CORS configuration: allowing all domains (can be restricted as needed)
app.use(cors({
    origin: '*', // Allow all domains or restrict to specific frontend domains
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));

app.options('*', cors()); // Handles preflight requests for CORS

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB connection (replace with your own URI if necessary)
mongoose.connect("mongodb+srv://Dev:Devpatel123@cluster0.w7lmtlf.mongodb.net")
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log('MongoDB connection error: ' + err));




// MongoDB connection URL
const mongoURI = 'mongodb+srv://Dev:Devpatel123@cluster0.w7lmtlf.mongodb.net';

// Create mongoose connection
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Initialize GridFS stream
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('test'); 
});

// Set up multer storage engine to handle file uploads
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// Endpoint to upload MP4 file
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const writeStream = gfs.createWriteStream({
    filename: req.file.originalname,
    content_type: req.file.mimetype,
  });

  writeStream.on('close', (file) => {
    res.status(200).send({ fileId: file._id, message: 'File uploaded successfully!' });
  });

  writeStream.write(req.file.buffer);
  writeStream.end();
});

app.get('/api/upload', upload.single('file'), (req, res) => {
    // if (!req.file) {
    //   return res.status(400).send('No file uploaded.');
    // }
  
    // const writeStream = gfs.createWriteStream({
    //   filename: req.file.originalname,
    //   content_type: req.file.mimetype,
    // });
  
    // writeStream.on('close', (file) => {
    //   res.status(200).send({ fileId: file._id, message: 'File uploaded successfully!' });
    // });
  
    // writeStream.write(req.file.buffer);
    // writeStream.end();
  });



// CREATE: Add a new product
app.post('/api/listed', async (req, res) => {
    try {
        const product = new Product(req.body); // Create new product instance with request body
        const savedProduct = await product.save(); // Save product to MongoDB
        res.status(201).json(savedProduct); // Return the saved product
    } catch (error) {
        res.status(400).json({ message: error.message }); // Return error message if any
    }
});

// READ: Get all product entries
app.get('/api/listed', async (req, res) => {
    try {
        const products = await Product.find(); // Retrieve all products from MongoDB
        res.status(200).json(products); // Return all products
    } catch (error) {
        res.status(500).json({ message: error.message }); // Return error message if any
    }
});

// READ: Get a single product entry by ID
app.get('/api/listed/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // Retrieve product by ID
        if (!product) return res.status(404).json({ message: 'Product not found' }); // If not found
        res.status(200).json(product); // Return the product
    } catch (error) {
        res.status(500).json({ message: error.message }); // Return error message if any
    }
});

// UPDATE: Update a product entry by ID
app.put('/api/listed/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update the product
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' }); // If not found
        res.status(200).json(updatedProduct); // Return the updated product
    } catch (error) {
        res.status(400).json({ message: error.message }); // Return error message if any
    }
});

// DELETE: Delete a product entry by ID
app.delete('/api/listed/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id); // Delete the product by ID
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' }); // If not found
        res.status(200).json({ message: 'Product deleted successfully' }); // Return success message
    } catch (error) {
        res.status(500).json({ message: error.message }); // Return error message if any
    }
});

// DELETE: Delete all product entries (optional)
app.delete('/api/listed', async (req, res) => {
    try {
        await Product.deleteMany({}); // Delete all products
        res.status(200).json({ message: 'All products deleted successfully' }); // Return success message
    } catch (error) {
        res.status(500).json({ message: error.message }); // Return error message if any
    }
});

// Handle OPTIONS requests (CORS preflight request)
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end(); // Respond to preflight request
});

// Set the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
