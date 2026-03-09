const mongoose = require('mongoose');

// ----------------------------------------------------------------
// Sub-schema for each item in an order
// ----------------------------------------------------------------
const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: [true, 'productId is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'quantity is required'],
      min: [1, 'quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
      min: [0, 'price cannot be negative'],
    },
  },
  { _id: true }
);

// ----------------------------------------------------------------
// Main Order schema — stored in English field names after mapping
// ----------------------------------------------------------------
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, 'orderId is required'],
      unique: true,
      trim: true,
      index: true,
    },
    value: {
      type: Number,
      required: [true, 'value is required'],
      min: [0, 'value cannot be negative'],
    },
    creationDate: {
      type: Date,
      required: [true, 'creationDate is required'],
    },
    items: {
      type: [itemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Order must have at least one item',
      },
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt
    versionKey: '__v',
  }
);

module.exports = mongoose.model('Order', orderSchema);
