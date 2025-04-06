const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MongoDB connection
mongoose.connect("mongodb+srv://Dev:Devpatel123@cluster0.w7lmtlf.mongodb.net")
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log('MongoDB connection error: ' + err));

// Define the Product schema
const productSchema = new Schema({
  productId: {
    type: String,
    unique: true
  },
  type: {
    type: String
     
  },
  productLine: {   // Adding product line outside of the schema
    type: String  // Default value for product line
  },
  productImage: [{
    imageid: {
      type: String
       
    },
    imageurl: {
      type: String
       
    },
    key: {
      type: String
       
    }
  }],
  name: {
    type: String
     
  },
  fabric: {
    type: String
     
  },
  pattern: {
    type: String
     
  },
  comboOf: {
    type: String
     
  },
  sizes: {
    type: [String],
    enum: ['S', 'M', 'L', 'XL', 'XXL'],   // Enum for valid 
  },
  rate: {
    type: Number
     
  },
  countryOfOrigin: {
    type: String
     
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create a model using the schema
const Product = mongoose.model('listed', productSchema);

module.exports = Product;
