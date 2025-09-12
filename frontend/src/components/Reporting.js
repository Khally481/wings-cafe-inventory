import React from 'react';

const Reporting = ({ products = [], transactions = [] }) => {
  // --- Per product sales data ---
  const productSalesData = products.map(product => {
    const productTransactions = transactions.filter(
      t => String(t.productId) === String(product.id) && t.type === 'sale'
    );

    const unitsSold = productTransactions.reduce(
      (sum, t) => sum + (Number(t.quantity) || 0),
      0
    );

    // Use product.price because transactions don't have unitPrice
    const revenue = unitsSold * (Number(product.price) || 0);

    // Example: 30% profit margin
    const profit = revenue * 0.3;

    const stockLeft = Number(product.quantity) || 0;

    return {
      ...product,
      unitsSold,
      revenue,
      profit,
      stockLeft
    };
  });

  // --- Totals ---
  const totalUnitsSold = productSalesData.reduce((sum, p) => sum + p.unitsSold, 0);
  const totalRevenue = productSalesData.reduce((sum, p) => sum + p.revenue, 0);
  const totalProfit = productSalesData.reduce((sum, p) => sum + p.profit, 0);
  const totalStockLeft = productSalesData.reduce((sum, p) => sum + p.stockLeft, 0);
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + ((Number(p.quantity) || 0) * (Number(p.price) || 0)),
    0
  );

  const lowStockItems = products.filter(
    p => Number(p.quantity) <= (Number(p.lowStockThreshold) || 0)
  );

  return (
    <div>
      <h2>Reports & Analytics</h2>

      {/* === Summary Metrics === */}
      <div className="card">
        <h3>Business Summary</h3>
        <div className="summary-grid">
          <div className="summary-item"><h4>Total Units Sold</h4><p>{totalUnitsSold}</p></div>
          <div className="summary-item"><h4>Total Revenue</h4><p>M{totalRevenue.toFixed(2)}</p></div>
          <div className="summary-item"><h4>Total Profit</h4><p>M{totalProfit.toFixed(2)}</p></div>
          <div className="summary-item"><h4>Total Stock Left</h4><p>{totalStockLeft}</p></div>
          <div className="summary-item"><h4>Total Inventory Value</h4><p>M{totalInventoryValue.toFixed(2)}</p></div>
          <div className="summary-item"><h4>Low Stock Items</h4><p>{lowStockItems.length}</p></div>
        </div>
      </div>

      {/* === Product Breakdown Table === */}
      <div className="card">
        <h3>Product Performance</h3>
        {productSalesData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue (M)</th>
                <th>Profit (M)</th>
                <th>Stock Left</th>
              </tr>
            </thead>
            <tbody>
              {productSalesData
                .sort((a, b) => b.unitsSold - a.unitsSold)
                .map(product => {
                  const isLowStock =
                    product.stockLeft <= (Number(product.lowStockThreshold) || 0);

                  return (
                    <tr
                      key={product.id}
                      style={{
                        backgroundColor: isLowStock ? '#ffe6e6' : 'transparent',
                        color: isLowStock ? '#d8000c' : 'inherit'
                      }}
                    >
                      <td>{product.name || 'Unknown'}</td>
                      <td>{product.unitsSold}</td>
                      <td>M{product.revenue.toFixed(2)}</td>
                      <td>M{product.profit.toFixed(2)}</td>
                      <td>{product.stockLeft}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <p>No sales data available.</p>
        )}
      </div>
    </div>
  );
};

export default Reporting;
