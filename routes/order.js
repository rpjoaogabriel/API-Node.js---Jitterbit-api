const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrder,
  listOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

// NOTE: /order/list MUST be declared before /order/:numeroPedido
// to prevent Express from treating "list" as a parameter value.

// ── Optional: uncomment to require JWT on all order routes ──
// const { authenticate } = require('../middleware/auth');
// router.use(authenticate);

/**
 * @route   GET /order/list
 * @desc    List all orders
 * @access  Public (or Protected if authenticate middleware is added)
 */
router.get('/list', listOrders);

/**
 * @route   POST /order
 * @desc    Create a new order
 * @access  Public
 */
router.post('/', createOrder);

/**
 * @route   GET /order/:numeroPedido
 * @desc    Get a single order by order number
 * @access  Public
 */
router.get('/:numeroPedido', getOrder);

/**
 * @route   PUT /order/:numeroPedido
 * @desc    Update an existing order
 * @access  Public
 */
router.put('/:numeroPedido', updateOrder);

/**
 * @route   DELETE /order/:numeroPedido
 * @desc    Delete an order
 * @access  Public
 */
router.delete('/:numeroPedido', deleteOrder);

module.exports = router;
