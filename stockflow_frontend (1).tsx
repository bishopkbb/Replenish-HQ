import React, { useState } from 'react';
import { Menu, X, LogOut, Home, Package, ShoppingCart, Truck, BarChart3, Settings, Bell, User } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Data
const mockSalesData = [
  { day: 'Mon', sales: 4200, revenue: 24000 },
  { day: 'Tue', sales: 3800, revenue: 21500 },
  { day: 'Wed', sales: 5200, revenue: 29400 },
  { day: 'Thu', sales: 4800, revenue: 27200 },
  { day: 'Fri', sales: 6200, revenue: 35000 },
  { day: 'Sat', sales: 7100, revenue: 40200 },
];

const mockProducts = [
  { id: 1, name: 'Laptop', sku: 'LAP001', price: 1200, cost: 800, stock: 5, category: 'Electronics', threshold: 3, status: 'ok' },
  { id: 2, name: 'Mouse', sku: 'MOU001', price: 25, cost: 10, stock: 2, category: 'Accessories', threshold: 10, status: 'low' },
  { id: 3, name: 'Keyboard', sku: 'KEY001', price: 75, cost: 30, stock: 0, category: 'Accessories', threshold: 5, status: 'out' },
  { id: 4, name: 'Monitor', sku: 'MON001', price: 300, cost: 150, stock: 8, category: 'Electronics', threshold: 2, status: 'ok' },
  { id: 5, name: 'USB Cable', sku: 'USB001', price: 5, cost: 1, stock: 50, category: 'Accessories', threshold: 20, status: 'ok' },
];

const mockSuppliers = [
  { id: 1, name: 'Tech Supplies Co', email: 'contact@techsupplies.com', phone: '+234-801-234-5678' },
  { id: 2, name: 'Global Electronics', email: 'sales@globalelec.com', phone: '+234-802-345-6789' },
];

const mockOrders = [
  { id: 'PO-001', supplier: 'Tech Supplies Co', date: '2024-01-15', status: 'pending', total: 5000 },
  { id: 'PO-002', supplier: 'Global Electronics', date: '2024-01-14', status: 'received', total: 8500 },
];

// Dashboard Component
function Dashboard() {
  const totalProducts = mockProducts.length;
  const outOfStock = mockProducts.filter(p => p.stock === 0).length;
  const lowStock = mockProducts.filter(p => p.stock > 0 && p.stock <= p.threshold).length;
  const todayRevenue = 12500;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={totalProducts} color="blue" />
        <StatCard label="Out of Stock" value={outOfStock} color="red" />
        <StatCard label="Low Stock" value={lowStock} color="yellow" />
        <StatCard label="Today's Revenue" value={`₦${todayRevenue.toLocaleString()}`} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockProducts.slice(0, 4)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { product: 'Laptop', qty: 1, amount: '₦1,200', time: '10:30 AM' },
                { product: 'Mouse', qty: 3, amount: '₦75', time: '11:15 AM' },
                { product: 'USB Cable', qty: 5, amount: '₦25', time: '2:45 PM' },
              ].map((txn, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{txn.product}</td>
                  <td className="px-4 py-2">{txn.qty}</td>
                  <td className="px-4 py-2">{txn.amount}</td>
                  <td className="px-4 py-2">{txn.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
  };
  return (
    <div className={`p-4 rounded-lg ${colors[color]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

// Products Component
function Products() {
  const [products, setProducts] = useState(mockProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', cost: '', stock: '', threshold: '', category: '' });

  const handleAddProduct = () => {
    if (formData.name && formData.sku && formData.price) {
      if (editingId) {
        setProducts(products.map(p => p.id === editingId ? {
          ...p,
          ...formData,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost),
          stock: parseInt(formData.stock),
          threshold: parseInt(formData.threshold),
        } : p));
        setEditingId(null);
      } else {
        const newProduct = {
          id: Math.max(...products.map(p => p.id), 0) + 1,
          ...formData,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost),
          stock: parseInt(formData.stock),
          threshold: parseInt(formData.threshold),
          status: 'ok',
        };
        setProducts([...products, newProduct]);
      }
      setFormData({ name: '', sku: '', price: '', cost: '', stock: '', threshold: '', category: '' });
      setShowModal(false);
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      threshold: product.threshold,
      category: product.category,
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button onClick={() => { setEditingId(null); setFormData({ name: '', sku: '', price: '', cost: '', stock: '', threshold: '', category: '' }); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{p.name}</td>
                <td className="px-6 py-4">{p.sku}</td>
                <td className="px-6 py-4">₦{p.price}</td>
                <td className="px-6 py-4">{p.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.stock === 0 ? 'bg-red-100 text-red-700' : p.stock <= p.threshold ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {p.stock === 0 ? 'Out' : p.stock <= p.threshold ? 'Low' : 'OK'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button onClick={() => handleEditProduct(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="SKU" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border px-3 py-2 rounded" />
              <input type="number" placeholder="Selling Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border px-3 py-2 rounded" />
              <input type="number" placeholder="Cost Price" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="w-full border px-3 py-2 rounded" />
              <input type="number" placeholder="Stock Qty" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full border px-3 py-2 rounded" />
              <input type="number" placeholder="Reorder Threshold" value={formData.threshold} onChange={e => setFormData({...formData, threshold: e.target.value})} className="w-full border px-3 py-2 rounded" />
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border px-3 py-2 rounded">
                <option value="">Select Category</option>
                <option>Electronics</option>
                <option>Accessories</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleAddProduct} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{editingId ? 'Update' : 'Add'}</button>
              <button onClick={() => { setShowModal(false); setEditingId(null); setFormData({ name: '', sku: '', price: '', cost: '', stock: '', threshold: '', category: '' }); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// POS Component
function POS() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? {...item, qty: item.qty + 1} : item));
    } else {
      setCart([...cart, {...product, qty: 1}]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    setReceiptData({
      id: `RCP-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      items: cart,
      total: totalAmount,
    });
    setShowReceipt(true);
  };

  const handleCompletePayment = () => {
    alert('Payment successful! Receipt sent.');
    setCart([]);
    setShowReceipt(false);
    setReceiptData(null);
  };

  const handleClearCart = () => {
    if (cart.length === 0) {
      alert('Cart is already empty!');
      return;
    }
    if (window.confirm('Clear all items from cart?')) {
      setCart([]);
    }
  };

  const filteredProducts = mockProducts.filter(p => 
    p.stock > 0 && (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-4">Point of Sale</h1>
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <input type="text" placeholder="Search product or scan barcode..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full border px-4 py-2 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} onClick={() => addToCart(product)} className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg">
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-600">₦{product.price}</p>
              <p className="text-xs text-gray-500">Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 h-fit sticky top-6">
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">{item.qty}x ₦{item.price}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800 text-sm font-bold">×</button>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total:</span>
            <span className="text-lg font-bold">₦{totalAmount.toLocaleString()}</span>
          </div>
          <button onClick={handleCheckout} className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 mb-2">Checkout</button>
          <button onClick={handleClearCart} className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 font-semibold">Clear Cart</button>
        </div>
      </div>

      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Receipt</h2>
            <div className="border-b pb-4 mb-4 text-sm">
              <p><strong>Receipt ID:</strong> {receiptData.id}</p>
              <p><strong>Date:</strong> {receiptData.date}</p>
              <p><strong>Time:</strong> {receiptData.time}</p>
            </div>
            <div className="mb-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-2 py-1 font-semibold">Item</th>
                    <th className="text-right px-2 py-1 font-semibold">Qty</th>
                    <th className="text-right px-2 py-1 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData.items.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="px-2 py-1">{item.name}</td>
                      <td className="text-right px-2 py-1">{item.qty}</td>
                      <td className="text-right px-2 py-1">₦{(item.price * item.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span>₦{receiptData.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={handleCompletePayment} className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700">Complete Payment</button>
              <button onClick={() => setShowReceipt(false)} className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Suppliers Component
function Suppliers() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleAddSupplier = () => {
    if (formData.name && formData.email && formData.phone) {
      if (editingId) {
        setSuppliers(suppliers.map(s => s.id === editingId ? {
          ...s,
          ...formData,
        } : s));
        setEditingId(null);
      } else {
        const newSupplier = {
          id: Math.max(...suppliers.map(s => s.id), 0) + 1,
          ...formData,
        };
        setSuppliers([...suppliers, newSupplier]);
      }
      setFormData({ name: '', email: '', phone: '' });
      setShowModal(false);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleEditSupplier = (supplier) => {
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
    });
    setEditingId(supplier.id);
    setShowModal(true);
  };

  const handleDeleteSupplier = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
        <button onClick={() => { setEditingId(null); setFormData({ name: '', email: '', phone: '' }); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ Add Supplier</button>
      </div>

      <div className="grid gap-4">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-lg">{supplier.name}</h3>
            <p className="text-sm text-gray-600">📧 {supplier.email}</p>
            <p className="text-sm text-gray-600">📱 {supplier.phone}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEditSupplier(supplier)} className="text-blue-600 hover:underline text-sm">Edit</button>
              <button onClick={() => handleDeleteSupplier(supplier.id)} className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Supplier Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border px-3 py-2 rounded" />
              <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border px-3 py-2 rounded" />
              <input type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleAddSupplier} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{editingId ? 'Update' : 'Add'}</button>
              <button onClick={() => { setShowModal(false); setEditingId(null); setFormData({ name: '', email: '', phone: '' }); }} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Purchase Orders Component
function Orders() {
  const [orders] = useState(mockOrders);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">+ New Order</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Supplier</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.supplier}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">₦{order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Analytics Component
function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Weekly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Settings Component
function Settings() {
  const [businessName, setBusinessName] = useState('ReplenishHQ Store');
  const [email, setEmail] = useState('info@replenishhq.com');
  const [phone, setPhone] = useState('+234-801-234-5678');
  const [address, setAddress] = useState('123 Commerce Street, Abuja, Nigeria');
  const [currency, setCurrency] = useState('NGN');
  const [taxRate, setTaxRate] = useState(15);
  const [receiptHeader, setReceiptHeader] = useState('Welcome to ReplenishHQ');
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [lowStockNotif, setLowStockNotif] = useState(true);
  const [orderNotif, setOrderNotif] = useState(true);
  const [dailyNotif, setDailyNotif] = useState(false);

  const handleSaveBusinessSettings = () => {
    alert('Business settings saved successfully!');
  };

  const handleSaveSystemSettings = () => {
    alert('System settings saved successfully!');
  };

  const handleBackup = () => {
    alert('Data backed up successfully!');
  };

  const handleRestore = () => {
    alert('Data restored successfully!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      alert('All data has been cleared!');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Business Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input 
                type="text" 
                placeholder="Business Name" 
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input 
                type="text" 
                placeholder="Phone" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea 
                placeholder="Address" 
                rows="3" 
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
            <button onClick={handleSaveBusinessSettings} className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">Save Business Settings</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select 
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
              <input 
                type="number" 
                placeholder="15" 
                value={taxRate}
                onChange={e => setTaxRate(parseInt(e.target.value))}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Receipt Header</label>
              <input 
                type="text" 
                placeholder="Receipt Header" 
                value={receiptHeader}
                onChange={e => setReceiptHeader(e.target.value)}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={autoBackup}
                onChange={e => setAutoBackup(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Enable Auto Backup</label>
            </div>
            <button onClick={handleSaveSystemSettings} className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">Save System Settings</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={handleBackup} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium">
            📥 Backup Data
          </button>
          <button onClick={handleRestore} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
            📤 Restore Data
          </button>
          <button onClick={handleClearData} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium">
            🗑️ Clear All Data
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Email Notifications</span>
            <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} className="w-4 h-4 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Low Stock Alerts</span>
            <input type="checkbox" checked={lowStockNotif} onChange={e => setLowStockNotif(e.target.checked)} className="w-4 h-4 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Order Updates</span>
            <input type="checkbox" checked={orderNotif} onChange={e => setOrderNotif(e.target.checked)} className="w-4 h-4 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Daily Summary</span>
            <input type="checkbox" checked={dailyNotif} onChange={e => setDailyNotif(e.target.checked)} className="w-4 h-4 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function ReplenishHQ() {
  const [currentUser] = useState({ name: 'John Doe', role: 'Admin' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [transactions, setTransactions] = useState([
    { product: 'Laptop', qty: 1, amount: 1200, time: '10:30 AM' },
    { product: 'Mouse', qty: 3, amount: 75, time: '11:15 AM' },
    { product: 'USB Cable', qty: 5, amount: 25, time: '2:45 PM' },
  ]);
  const [notifications] = useState([
    { id: 1, message: 'Mouse stock is low (2 units)', time: '10 min ago', type: 'warning' },
    { id: 2, message: 'Keyboard is out of stock', time: '2 hours ago', type: 'critical' },
    { id: 3, message: 'PO-001 has been received', time: '5 hours ago', type: 'success' },
  ]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const pages = {
    dashboard: Dashboard,
    products: Products,
    pos: POS,
    suppliers: Suppliers,
    orders: Orders,
    analytics: Analytics,
    settings: Settings,
  };

  const CurrentPage = pages[currentPage];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">ReplenishHQ</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-800 p-2 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${currentPage === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-gray-400">{currentUser.role}</p>
            </div>
          )}
          <button className="w-full mt-4 flex items-center gap-2 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">{menuItems.find(m => m.id === currentPage)?.label}</h2>
          <div className="flex items-center gap-4 relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              {notifications.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <p className="text-sm text-gray-900">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <User size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <CurrentPage />
        </div>
      </div>
    </div>
  );
}