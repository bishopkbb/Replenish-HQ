import React, { useState } from 'react';
import { CartItem, ReceiptData } from '@/types';
import { MOCK_PRODUCTS } from '@/utils/constants';
import { formatCurrency } from '@/utils/format';

export const POS: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const addToCart = (product: typeof MOCK_PRODUCTS[0]) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? {...item, qty: item.qty + 1} 
          : item
      ));
    } else {
      setCart([...cart, {...product, qty: 1}]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => 
      item.id === id ? {...item, qty} : item
    ));
  };

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
    // Save sale to localStorage for Sales History
    if (receiptData) {
      const sale = {
        id: receiptData.id,
        date: receiptData.date,
        time: receiptData.time,
        customerName: 'Walk-in Customer',
        items: receiptData.items.map(item => ({
          productId: item.id,
          productName: item.name,
          sku: item.sku,
          quantity: item.qty,
          unitPrice: item.price,
          total: item.price * item.qty,
        })),
        subtotal: receiptData.total,
        tax: receiptData.total * 0.15, // 15% tax
        discount: 0,
        total: receiptData.total * 1.15,
        paymentMethod: 'cash' as const,
        status: 'completed' as const,
      };

      // Get existing sales from localStorage
      const existingSales = JSON.parse(localStorage.getItem('replenishhq_sales') || '[]');
      existingSales.unshift(sale); // Add to beginning
      // Keep only last 100 sales to prevent localStorage overflow
      const limitedSales = existingSales.slice(0, 100);
      localStorage.setItem('replenishhq_sales', JSON.stringify(limitedSales));
      // Dispatch event to update Sales History page
      window.dispatchEvent(new Event('newSaleAdded'));
    }

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

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.stock > 0 && (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Point of Sale</h1>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4">
          <input
            type="text"
            placeholder="Search product or scan barcode..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border px-3 sm:px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-3 sm:p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
            >
              <p className="font-semibold text-sm sm:text-base">{product.name}</p>
              <p className="text-xs sm:text-sm text-gray-600">{formatCurrency(product.price)}</p>
              <p className="text-xs text-gray-500">Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-3 sm:p-4 h-fit lg:sticky lg:top-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Cart</h2>
        <div className="space-y-2 mb-3 sm:mb-4 max-h-48 sm:max-h-64 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500 text-center py-4">Cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs sm:text-sm"
                    >
                      -
                    </button>
                    <span className="text-xs text-gray-500">{item.qty}x {formatCurrency(item.price)}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs sm:text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 text-base sm:text-lg font-bold ml-2 flex-shrink-0"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        <div className="border-t pt-3 sm:pt-4">
          <div className="flex justify-between mb-3 sm:mb-4">
            <span className="font-semibold text-sm sm:text-base">Total:</span>
            <span className="text-base sm:text-lg font-bold">{formatCurrency(totalAmount)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 mb-2 transition-colors text-sm sm:text-base"
            disabled={cart.length === 0}
          >
            Checkout
          </button>
          <button
            onClick={handleClearCart}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 font-semibold transition-colors text-sm sm:text-base"
            disabled={cart.length === 0}
          >
            Clear Cart
          </button>
        </div>
      </div>

      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                      <td className="text-right px-2 py-1">{formatCurrency(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total:</span>
                <span>{formatCurrency(receiptData.total)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleCompletePayment}
                className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors"
              >
                Complete Payment
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 font-semibold transition-colors"
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

