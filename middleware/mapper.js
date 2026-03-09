/**
 * Maps the incoming request payload (Portuguese field names)
 * to the internal database schema (English field names).
 *
 * Input:
 *  { numeroPedido, valorTotal, dataCriacao, items: [{ idItem, quantidadeItem, valorItem }] }
 *
 * Output:
 *  { orderId, value, creationDate, items: [{ productId, quantity, price }] }
 */
const mapRequestToSchema = (body) => {
  const { numeroPedido, valorTotal, dataCriacao, items } = body;

  return {
    orderId: numeroPedido,
    value: valorTotal,
    creationDate: new Date(dataCriacao),
    items: Array.isArray(items)
      ? items.map((item) => ({
          productId: parseInt(item.idItem, 10),
          quantity: item.quantidadeItem,
          price: item.valorItem,
        }))
      : [],
  };
};

/**
 * Maps a stored Order document back to the clean API response shape.
 */
const mapSchemaToResponse = (order) => ({
  orderId: order.orderId,
  value: order.value,
  creationDate: order.creationDate,
  items: order.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
  })),
});

module.exports = { mapRequestToSchema, mapSchemaToResponse };
