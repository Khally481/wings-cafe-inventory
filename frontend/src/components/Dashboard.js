import React from "react";

// 👇 Import product images
import product1Img from "../assets/images/coffee.jpg";
import product2Img from "../assets/images/sandwich.jpg";
import product3Img from "../assets/images/niknaks.jpg";
import product4Img from "../assets/images/Toast.jpg";

const Dashboard = ({ products }) => {
  // Add safe default for products if it's undefined or empty
  const safeProducts = products || [];
  
  const lowStockProducts = safeProducts.filter((product) => product.lowStockAlert);
  const totalProducts = safeProducts.length;
  
  // Add initial value of 0 to reduce function to prevent error with empty array
  const totalValue = safeProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0 // Initial value added here
  );

  // 👇 Map product IDs/names to images
  const imageMap = {
    1: product1Img,
    2: product2Img,
    3: product3Img,
    4: product4Img,
  };

  return (
    <div className="dashboard">
      {/* === Stats Section === */}
      <div className="stats-row">
        <div className="card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>

        <div className="card">
          <h3>Inventory Value</h3>
          <p>M{totalValue.toFixed(2)}</p>
        </div>

        <div className="card">
          <h3>Low Stock Alerts</h3>
          <p>{lowStockProducts.length} products need restocking</p>
        </div>

        <div className="card">
          <h3>Low Stock Items</h3>
          <ul className="low-stock-list">
            {lowStockProducts.map((product) => (
              <li key={product.id} className="low-stock-item">
                <span>{product.name}</span>
                <span className="low-stock-alert">{product.quantity} left</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* === Product Cards Section === */}
      <div className="product-gallery">
        {safeProducts.slice(0, 4).map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={imageMap[product.id]}  // ✅ use the imported image
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h4>{product.name}</h4>
              <p>M{product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;