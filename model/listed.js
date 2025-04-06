const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://Dev:Devpatel123@cluster0.w7lmtlf.mongodb.net")
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));
// Define the Product schema
const productSchema = new Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  type: {type: String},
  productImage: { type: String},
  name: {type: String},
  price: {type: Number},
 
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create a model using the schema
const Product = mongoose.model('listed', productSchema);

module.exports = Product;
