const Order = require('../models/Order');
const { mapRequestToSchema, mapSchemaToResponse } = require('../middleware/mapper');

// ================================================================
// POST /order
// Create a new order
// ================================================================
const createOrder = async (req, res) => {
  try {
    // 1. Validate required fields
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: numeroPedido, valorTotal, dataCriacao, items',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'items must be a non-empty array',
      });
    }

    // 2. Check for duplicate orderId
    const existing = await Order.findOne({ orderId: numeroPedido });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Order with numeroPedido "${numeroPedido}" already exists`,
      });
    }

    // 3. Map input fields (PT) → schema fields (EN)
    const orderData = mapRequestToSchema(req.body);

    // 4. Persist to MongoDB
    const order = await Order.create(orderData);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: mapSchemaToResponse(order),
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    console.error('createOrder error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ================================================================
// GET /order/:numeroPedido
// Retrieve a single order by its order number
// ================================================================
const getOrder = async (req, res) => {
  try {
    const { numeroPedido } = req.params;

    const order = await Order.findOne({ orderId: numeroPedido });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order "${numeroPedido}" not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: mapSchemaToResponse(order),
    });
  } catch (error) {
    console.error('getOrder error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ================================================================
// GET /order/list
// List all orders (optional feature)
// ================================================================
const listOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ creationDate: -1 });

    return res.status(200).json({
      success: true,
      total: orders.length,
      data: orders.map(mapSchemaToResponse),
    });
  } catch (error) {
    console.error('listOrders error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ================================================================
// PUT /order/:numeroPedido
// Update an existing order (optional feature)
// ================================================================
const updateOrder = async (req, res) => {
  try {
    const { numeroPedido } = req.params;

    // Map updated fields if provided
    const updateData = mapRequestToSchema({
      numeroPedido: req.body.numeroPedido ?? numeroPedido,
      valorTotal: req.body.valorTotal,
      dataCriacao: req.body.dataCriacao,
      items: req.body.items,
    });

    // Remove undefined values so partial updates work
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const order = await Order.findOneAndUpdate(
      { orderId: numeroPedido },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order "${numeroPedido}" not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: mapSchemaToResponse(order),
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    console.error('updateOrder error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ================================================================
// DELETE /order/:numeroPedido
// Delete an order by its order number (optional feature)
// ================================================================
const deleteOrder = async (req, res) => {
  try {
    const { numeroPedido } = req.params;

    const order = await Order.findOneAndDelete({ orderId: numeroPedido });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order "${numeroPedido}" not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order "${numeroPedido}" deleted successfully`,
    });
  } catch (error) {
    console.error('deleteOrder error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { createOrder, getOrder, listOrders, updateOrder, deleteOrde
