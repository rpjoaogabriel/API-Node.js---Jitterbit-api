# API-Node.js---Jitterbit-api
Desafio da Jitterbit para Jr System Analyst (2023)

A RESTful API built with **Node.js**, **Express**, and **MongoDB** to manage orders.

## Stack

| Technology | Version |
|------------|---------|
| Node.js    | ≥ 18    |
| Express    | ^4.18   |
| Mongoose   | ^7.5    |
| dotenv     | ^16     |
| jsonwebtoken | ^9.0  |

---

## Setup

```bash
# 1. Clone and enter the project
git clone <repo-url>
cd jitterbit-orders-api

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 4. Start (production)
npm start

# 5. Start (development — auto-reload)
npm run dev
```

Make sure MongoDB is running locally or provide a remote URI in `.env`.

---

## Endpoints

| Method | URL                           | Description              | Required |
|--------|-------------------------------|--------------------------|----------|
| POST   | `/order`                      | Create a new order       | ✅       |
| GET    | `/order/:numeroPedido`        | Get order by number      | ✅       |
| GET    | `/order/list`                 | List all orders          | Optional |
| PUT    | `/order/:numeroPedido`        | Update an order          | Optional |
| DELETE | `/order/:numeroPedido`        | Delete an order          | Optional |

---

## Data Mapping

The API receives data in Portuguese field names and maps them to English for storage:

| Input (PT)      | Stored (EN)    |
|-----------------|----------------|
| `numeroPedido`  | `orderId`      |
| `valorTotal`    | `value`        |
| `dataCriacao`   | `creationDate` |
| `idItem`        | `productId`    |
| `quantidadeItem`| `quantity`     |
| `valorItem`     | `price`        |

---

## Example Usage

### Create Order
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "v10089015vdb-01",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.529Z",
    "items": [
      { "productId": 2434, "quantity": 1, "price": 1000 }
    ]
  }
}
```

### Get Order
```bash
curl http://localhost:3000/order/v10089015vdb-01
```

### List All Orders
```bash
curl http://localhost:3000/order/list
```

### Update Order
```bash
curl -X PUT http://localhost:3000/order/v10089015vdb-01 \
  -H "Content-Type: application/json" \
  -d '{ "valorTotal": 12000 }'
```

### Delete Order
```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb-01
```

---

## HTTP Status Codes

| Code | Meaning                    |
|------|----------------------------|
| 200  | OK                         |
| 201  | Created                    |
| 400  | Bad Request (validation)   |
| 401  | Unauthorized               |
| 404  | Not Found                  |
| 409  | Conflict (duplicate)       |
| 500  | Internal Server Error      |

---

## Optional: JWT Authentication

To enable token-based authentication, uncomment the `authenticate` middleware in `src/routes/order.js`.

Generate a token:
```js
const jwt = require('jsonwebtoken');
const token = jwt.sign({ user: 'test' }, 'your_secret', { expiresIn: '24h' });
```

Use it in requests:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/order/list
```

---

## MongoDB Collection Structure

```json
{
  "_id": ObjectId("..."),
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": ISODate("2023-07-19T12:24:11.529Z"),
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000,
      "_id": ObjectId("...")
    }
  ],
  "__v": 0
}
```
