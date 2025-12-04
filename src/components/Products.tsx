import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { PRODUCT_CATEGORIES } from '@/utils/constants';
import { validateProduct } from '@/utils/validation';
import { formatCurrency } from '@/utils/format';
import { dataManager } from '@/utils/dataManager';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => dataManager.getProducts());

  // Listen for product updates
  useEffect(() => {
    const handleUpdate = () => {
      setProducts(dataManager.getProducts());
    };
    window.addEventListener('productsUpdated', handleUpdate);
    return () => window.removeEventListener('productsUpdated', handleUpdate);
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    cost: '',
    stock: '',
    threshold: '',
    category: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddProduct = () => {
    const validation = validateProduct(formData);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);

    let updatedProducts: Product[];
    
    if (editingId) {
      updatedProducts = products.map(p => p.id === editingId ? {
        ...p,
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
        threshold: parseInt(formData.threshold),
        category: formData.category,
        status: parseInt(formData.stock) === 0 ? 'out' : parseInt(formData.stock) <= parseInt(formData.threshold) ? 'low' : 'ok',
      } : p);
      setEditingId(null);
    } else {
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
        threshold: parseInt(formData.threshold),
        category: formData.category,
        status: parseInt(formData.stock) === 0 ? 'out' : parseInt(formData.stock) <= parseInt(formData.threshold) ? 'low' : 'ok',
      };
      updatedProducts = [...products, newProduct];
    }
    
    setProducts(updatedProducts);
    dataManager.saveProducts(updatedProducts);
    setFormData({ name: '', sku: '', price: '', cost: '', stock: '', threshold: '', category: '' });
    setShowModal(false);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      threshold: product.threshold.toString(),
      category: product.category,
    });
    setEditingId(product.id);
    setShowModal(true);
    setErrors([]);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      dataManager.saveProducts(updated);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', sku: '', price: '', cost: '', stock: '', threshold: '', category: '' });
    setEditingId(null);
    setShowModal(false);
    setErrors([]);
  };

  const getStatusBadge = (product: Product) => {
    if (product.stock === 0) {
      return 'bg-red-100 text-red-700';
    }
    if (product.stock <= product.threshold) {
      return 'bg-yellow-100 text-yellow-700';
    }
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (product: Product) => {
    if (product.stock === 0) return 'Out';
    if (product.stock <= product.threshold) return 'Low';
    return 'OK';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Name</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell">SKU</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Price</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Stock</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 font-medium text-sm">{p.name}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm hidden sm:table-cell">{p.sku}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{formatCurrency(p.price)}</td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm">{p.stock}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(p)}`}>
                      {getStatusText(p)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                <ul className="list-disc list-inside">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="SKU"
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Selling Price"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Cost Price"
                value={formData.cost}
                onChange={e => setFormData({...formData, cost: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Stock Qty"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Reorder Threshold"
                value={formData.threshold}
                onChange={e => setFormData({...formData, threshold: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddProduct}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

