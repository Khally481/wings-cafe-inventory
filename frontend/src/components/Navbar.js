import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/products" className="nav-link">Products</Link>
        </li>
        <li className="nav-item">
          <Link to="/stock" className="nav-link">Stock</Link>
        </li>
        <li className="nav-item">
          <Link to="/sales" className="nav-link">Sales</Link>
        </li>
        <li className="nav-item">
          <Link to="/inventory" className="nav-link">Inventory</Link>
        </li>
        <li className="nav-item">
          <Link to="/reporting" className="nav-link">Reporting</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;