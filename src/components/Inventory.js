import React from 'react';

const Inventory = ({ products, refreshProducts }) => {
  const categories = [...new Set(products.map(product => product.category))];

  return (
    <div>
      <h2>Inventory Overview</h2>
      
      {categories.map(category => (
        <div key={category} className="card">
          <h3>{category}</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Price (M)</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter(product => product.category === category)
                .map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>M{product.price.toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    <td>
                      {product.lowStockAlert ? (
                        <span className="low-stock-alert">Low Stock</span>
                      ) : (
                        <span>In Stock</span>
                      )}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Inventory;