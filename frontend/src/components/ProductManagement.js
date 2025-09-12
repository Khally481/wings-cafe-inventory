import React, { useState } from 'react';

const ProductManagement = ({ products, refreshProducts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    lowStockThreshold: '5'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      lowStockThreshold: parseInt(formData.lowStockThreshold)
    };

    try {
      if (isEditing) {
        await fetch(`http://localhost:3001/products/${currentProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...currentProduct,
            ...productData
          })
        });
      } else {
        await fetch('http://localhost:3001/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      }

      resetForm();
      refreshProducts();
      alert(`Product ${isEditing ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please check the console for details.');
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      lowStockThreshold: product.lowStockThreshold.toString()
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:3001/products/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          refreshProducts();
          alert('Product deleted successfully!');
        } else {
          alert('Failed to delete product. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please check the console for details.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: '',
      lowStockThreshold: '5'
    });
    setIsEditing(false);
    setCurrentProduct(null);
  };

  return (
    <div>
      <h2>Product Management</h2>

      {/* === Product List First === */}
      <div className="card">
        <h3>Product List</h3>
        {products.length === 0 ? (
          <p>No products found. Add your first product below.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price (M)</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>M{product.price.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    {product.lowStockAlert ? (
                      <span className="low-stock-alert">Low Stock</span>
                    ) : (
                      <span>In Stock</span>
                    )}
                  </td>
                  <td className="actions">
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Separator */}
      <hr style={{ margin: '30px 0', border: '1px solid #ddd' }} />

      {/* === Add/Edit Form After Product List === */}
      <div className="card">
        <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Price (M)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Initial Quantity</label>
            <input
              type="number"
              min="0"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Low Stock Threshold</label>
            <input
              type="number"
              min="1"
              name="lowStockThreshold"
              value={formData.lowStockThreshold}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
          
          {isEditing && (
            <button type="button" className="btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;
