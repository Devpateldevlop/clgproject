const mongoose=require('mongoose');
const { MIMEType } = require('util');
const schema=require('mongoose').Schema;

mongoose.connect("mongodb+srv://Dev:Devpatel123@cluster0.w7lmtlf.mongodb.net")
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));
// Define the Product schema

const productSchema = new schema({ 

    productId: {type: String,unique: true},
    filename: {type: String},
    videoData: [{ type: Buffer }]
})


const Product = mongoose.model('upload', productSchema);

module.exports = Product;
