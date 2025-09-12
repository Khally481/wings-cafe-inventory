const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('database.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom middleware to handle low stock alerts
server.use((req, res, next) => {
  if (req.method === 'GET' && req.path === '/products') {
    const products = router.db.get('products').value();
    products.forEach(product => {
      if (product.quantity <= product.lowStockThreshold) {
        product.lowStockAlert = true;
      } else {
        product.lowStockAlert = false;
      }
    });
    router.db.set('products', products).write();
  }
  next();
});

server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
