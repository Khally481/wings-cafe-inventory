import React, { useState } from "react";

const Sales = ({ products, refreshProducts, refreshTransactions }) => {
  const [quantities, setQuantities] = useState({});

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 0 || isNaN(newQuantity)) return;
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (newQuantity > product.quantity) {
      alert(`Only ${product.quantity} units of ${product.name} are available.`);
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const processSale = async () => {
    const itemsToSell = Object.keys(quantities)
      .filter((id) => quantities[id] > 0)
      .map((id) => {
        const product = products.find((p) => p.id === parseInt(id));
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantities[id],
        };
      });

    if (itemsToSell.length === 0) {
      alert("Please enter quantity for at least one product.");
      return;
    }

    try {
      // Process all updates in a single transaction for better performance
      const updatePromises = itemsToSell.map(async (item) => {
        const product = products.find((p) => p.id === item.productId);
        const newQuantity = product.quantity - item.quantity;

        // Update product stock
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
            type: "sale",
            quantity: item.quantity,
            unitPrice: product.price,
            totalAmount: item.quantity * product.price,
            date: new Date().toISOString(),
          }),
        });
      });

      await Promise.all(updatePromises);
      
      setQuantities({});
      refreshProducts();
      refreshTransactions();
      alert("Sale processed successfully!");
    } catch (error) {
      console.error("Error processing sale:", error);
      alert("Error processing sale. Please try again.");
    }
  };

  const getSubtotal = () =>
    Object.keys(quantities).reduce((total, id) => {
      const product = products.find((p) => p.id === parseInt(id));
      return total + product.price * (quantities[id] || 0);
    }, 0);

  // Filter out products with zero stock for better UX
  const availableProducts = products.filter(product => product.quantity > 0);

  return (
    <div>
      <h2>Sales</h2>

      {/* Product list for selection */}
      <div className="card">
        <h3>Select Products to Sell</h3>
        {availableProducts.length === 0 ? (
          <p>No products available for sale.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price (M)</th>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Subtotal (M)</th>
              </tr>
            </thead>
            <tbody>
              {availableProducts.map((product) => {
                const qty = quantities[product.id] || 0;
                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>M{product.price.toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <input
                        type="number"
                        value={qty}
                        min="0"
                        max={product.quantity}
                        onChange={(e) =>
                          updateQuantity(product.id, parseInt(e.target.value) || 0)
                        }
                        style={{ width: "60px" }}
                      />
                      <button 
                        className="btn btn-sm btn-primary"
                        style={{ marginLeft: "5px" }}
                        onClick={() => updateQuantity(product.id, 1)}
                        disabled={product.quantity === 0}
                      >
                        Add
                      </button>
                    </td>
                    <td>{qty > 0 ? "M" + (product.price * qty).toFixed(2) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Sale summary */}
      {Object.values(quantities).some((q) => q > 0) && (
        <div className="card">
          <h3>Sale Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price (M)</th>
                <th>Quantity</th>
                <th>Subtotal (M)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(quantities)
                .filter((id) => quantities[id] > 0)
                .map((id) => {
                  const product = products.find((p) => p.id === parseInt(id));
                  const qty = quantities[id];
                  return (
                    <tr key={id}>
                      <td>{product.name}</td>
                      <td>M{product.price.toFixed(2)}</td>
                      <td>{qty}</td>
                      <td>M{(product.price * qty).toFixed(2)}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => updateQuantity(parseInt(id), 0)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>M{getSubtotal().toFixed(2)}</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          <button className="btn btn-success" onClick={processSale}>
            Process Sale
          </button>
          <button
            className="btn btn-secondary"
            style={{ marginLeft: "10px" }}
            onClick={() => setQuantities({})}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Sales;