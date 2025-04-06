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
  clothingShot: {type: String},
  fabric: {type: String},
  sleeveLength: {type: String},
  pattern: {type: String},
  comboOf: {type: String},
  withDupatta: {type: Boolean},
  sizes: {type: [String],
    enum: ['S', 'M', 'L', 'XL', 'XXL']},
  rate: {type: Number },
  countryOfOrigin: { type: String}
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create a model using the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
