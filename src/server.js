import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

// import productRouter from './routes/productRouter.js';

const app = express();
const port = import.meta.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: import.meta.env.DB_HOST,
  user: import.meta.env.DB_USER,
  password: import.meta.env.DB_PASSWORD,
  database: import.meta.env.DB_NAME,
  connectionLimit: 10,
});

// app.get('/api', productRouter);
app.get('/api/products', (req, res) => {
  pool.query('SELECT * FROM products', (error, results) => {
    if (error) {
      console.error('Error retrieving products:', error);
      res.status(500).json({ error: 'Error retrieving products' });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/products', (req, res) => {
  const { name, price, quantity } = req.body;
  console.log(req);
  const sql = 'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)';
  const values = [name, price, quantity];

  pool.query(sql, values, (error, result) => {
    if (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Error creating product' });
    } else {
      res.status(201).json({
        message: 'Product created successfully',
        productId: result.insertId,
      });
    }
  });
});

app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  const sql =
    'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?';
  const values = [
    updatedProduct.name,
    updatedProduct.price,
    updatedProduct.quantity,
    productId,
  ];

  pool.query(sql, values, (error, result) => {
    if (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Error updating product' });
    } else {
      // Check if any rows were affected by the update query
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.json({ message: 'Product updated successfully' });
      }
    }
  });
});

app.get('/api/orders', (req, res) => {
  const sql = `
      SELECT o.id, o.status, o.tracking, p.id AS product_id, p.name AS product_name, op.quantity
      FROM orders AS o
      LEFT JOIN order_products AS op ON o.id = op.order_id
      LEFT JOIN products AS p ON op.product_id = p.id
    `;

  pool.query(sql, (error, result) => {
    if (error) {
      console.error('Error retrieving orders:', error);
      res.status(500).json({ error: 'Error retrieving orders' });
    } else {
      const orders = [];

      // Group products by order ID
      const ordersMap = new Map();
      result.forEach((row) => {
        const orderId = row.id;

        if (!ordersMap.has(orderId)) {
          ordersMap.set(orderId, {
            id: orderId,
            status: row.status,
            tracking: row.tracking,
            products: [],
          });
        }

        const order = ordersMap.get(orderId);
        if (row.product_id) {
          order.products.push({
            id: row.product_id,
            name: row.product_name,
            quantity: row.quantity,
          });
        }
      });

      // Convert map to array
      ordersMap.forEach((order) => {
        orders.push(order);
      });

      res.status(200).json(orders);
    }
  });
});

app.post('/api/orders', (req, res) => {
  const { products } = req.body;

  const order = {};

  const sqlInsertOrder = 'INSERT INTO orders () VALUES ()';

  pool.query(sqlInsertOrder, order, (error, result) => {
    if (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Error creating order' });
    } else {
      const orderId = result.insertId;

      const orderProducts = products.map((product) => {
        return [orderId, product.product_id, product.quantity];
      });

      const sqlInsertOrderProducts =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES ?';

      pool.query(sqlInsertOrderProducts, [orderProducts], (error, result) => {
        if (error) {
          console.error('Error creating order products:', error);
          res.status(500).json({ error: 'Error creating order products' });
        } else {
          res.status(201).json({
            message: 'Order created successfully',
            orderId: orderId,
          });
        }
      });
    }
  });
});

app.put('/api/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const { products, tracking, status } = req.body;

  const orderProducts = products.map((product) => {
    return [orderId, product.product_id, product.quantity];
  });

  const sqlDeleteOrderProducts =
    'DELETE FROM order_products WHERE order_id = ?';
  const sqlInsertOrderProducts =
    'INSERT INTO order_products (order_id, product_id, quantity) VALUES ?';
  const sqlUpdateOrder =
    'UPDATE orders SET tracking = ?, status = ? WHERE id = ?';

  pool.getConnection((error, connection) => {
    if (error) {
      console.error('Error getting connection from pool:', error);
      res.status(500).json({ error: 'Error updating order' });
    } else {
      connection.beginTransaction((error) => {
        if (error) {
          console.error('Error starting transaction:', error);
          res.status(500).json({ error: 'Error updating order' });
        } else {
          connection.query(
            sqlDeleteOrderProducts,
            orderId,
            (error, deleteResult) => {
              if (error) {
                console.error('Error deleting order products:', error);
                connection.rollback(() => {
                  res.status(500).json({ error: 'Error updating order' });
                });
              } else {
                connection.query(
                  sqlInsertOrderProducts,
                  [orderProducts],
                  (error, insertResult) => {
                    if (error) {
                      console.error('Error creating order products:', error);
                      connection.rollback(() => {
                        res.status(500).json({ error: 'Error updating order' });
                      });
                    } else {
                      connection.query(
                        sqlUpdateOrder,
                        [tracking, status, orderId],
                        (error) => {
                          if (error) {
                            console.error('Error updating order:', error);
                            connection.rollback(() => {
                              res
                                .status(500)
                                .json({ error: 'Error updating order' });
                            });
                          } else {
                            connection.commit((error) => {
                              if (error) {
                                console.error(
                                  'Error committing transaction:',
                                  error
                                );
                                connection.rollback(() => {
                                  res
                                    .status(500)
                                    .json({ error: 'Error updating order' });
                                });
                              } else {
                                res.status(200).json({
                                  message: 'Order updated successfully',
                                });
                              }
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      });
      connection.release();
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
