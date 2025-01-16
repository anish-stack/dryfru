const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    NumberOfProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;