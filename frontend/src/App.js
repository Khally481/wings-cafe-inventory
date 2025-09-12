import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import StockManagement from './components/StockManagement';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Reporting from './components/Reporting';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:3001/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard products={products} />} />
            <Route 
              path="/products" 
              element={
                <ProductManagement 
                  products={products} 
                  refreshProducts={fetchProducts} 
                />
              } 
            />
            <Route 
              path="/stock" 
              element={
                <StockManagement 
                  products={products} 
                  transactions={transactions}
                  refreshProducts={fetchProducts}
                  refreshTransactions={fetchTransactions}
                />
              } 
            />
            <Route 
              path="/sales" 
              element={
                <Sales 
                  products={products} 
                  refreshProducts={fetchProducts}
                  refreshTransactions={fetchTransactions}
                />
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <Inventory 
                  products={products} 
                  refreshProducts={fetchProducts}
                />
              } 
            />
            <Route 
              path="/reporting" 
              element={
                <Reporting 
                  products={products} 
                  transactions={transactions} 
                />
              } 
            />
          </Routes>
        </div>

        {/* Inline footer */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Wings Cafe. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
