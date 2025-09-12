import React, { useState } from "react";

const StockManagement = ({ products, transactions, refreshProducts, refreshTransactions }) => {
  const [quantities, setQuantities] = useState({}); // { productId: number }

  const updateQuantity = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleStockAdjustment = async (product, type) => {
    const qty = parseInt(quantities[product.id] || 0);
    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    let newQuantity = product.quantity;
    if (type === "add") {
      newQuantity += qty;
    } else if (type === "remove") {
      newQuantity -= qty;
      if (newQuantity < 0) newQuantity = 0;
    }

    try {
      // Update product
      await fetch(`http://localhost:3001/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      // Record transaction
      await fetch("http://localhost:3001/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          type: type === "add" ? "add" : "remove", // store simplified type
          quantity: qty,
          date: new Date().toISOString(),
        }),
      });

      setQuantities((prev) => ({ ...prev, [product.id]: "" }));
      refreshProducts();
      refreshTransactions();
    } catch (error) {
      console.error("Error adjusting stock:", error);
      alert("Error adjusting stock. Please try again.");
    }
  };

  return (
    <div>
      <h2>Stock Management</h2>

      <div className="card">
        <h3>Adjust Stock Levels</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Current Stock</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const qty = quantities[product.id] || "";
              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={qty}
                      onChange={(e) =>
                        updateQuantity(product.id, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleStockAdjustment(product, "add")}
                    >
                      Add Stock
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ marginLeft: "5px" }}
                      onClick={() => handleStockAdjustment(product, "remove")}
                    >
                      Deduct Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Stock Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const product = products.find((p) => p.id === transaction.productId);
              const typeLabel =
                transaction.type === "add" ? "Add Stock" : "Deduct Stock";
              return (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{product ? product.name : "Unknown Product"}</td>
                  <td>{typeLabel}</td>
                  <td>{transaction.quantity}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManagement;
