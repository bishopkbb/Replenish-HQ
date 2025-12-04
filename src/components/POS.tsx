import React, { useState, useEffect, useRef } from 'react';
import { CartItem, ReceiptData, Product, Customer } from '@/types';
import { formatCurrency } from '@/utils/format';
import { dataManager } from '@/utils/dataManager';
import { Users, Printer } from 'lucide-react';

export const POS: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => dataManager.getProducts());
  const [customers] = useState(() => {
    try {
      const saved = localStorage.getItem('replenishhq_customers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Listen for product updates
  useEffect(() => {
    const handleUpdate = () => {
      setProducts(dataManager.getProducts());
    };
    window.addEventListener('productsUpdated', handleUpdate);
    return () => window.removeEventListener('productsUpdated', handleUpdate);
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    const currentQty = existing ? existing.qty : 0;
    
    // Check if adding one more would exceed stock
    if (currentQty + 1 > product.stock) {
      alert(`Cannot add more. Only ${product.stock} units available in stock.`);
      return;
    }

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
    
    // Check stock availability
    const product = products.find(p => p.id === id);
    
    if (product && qty > product.stock) {
      alert(`Cannot order ${qty} units. Only ${product.stock} units available in stock.`);
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
    if (!receiptData) return;

    // Validate stock one more time before completing
    for (const item of receiptData.items) {
      const product = products.find(p => p.id === item.id);
      if (!product || product.stock < item.qty) {
        alert(`Insufficient stock for ${item.name}. Available: ${product?.stock || 0}`);
        return;
      }
    }

    // Update stock for each item
    receiptData.items.forEach(item => {
      dataManager.updateProductStock(item.id, -item.qty);
    });

    // Save sale
    const sale = {
      id: receiptData.id,
      date: receiptData.date,
      time: receiptData.time,
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      customerId: selectedCustomer?.id,
      items: receiptData.items.map(item => ({
        productId: item.id,
        productName: item.name,
        sku: item.sku,
        quantity: item.qty,
        unitPrice: item.price,
        total: item.price * item.qty,
      })),
      subtotal: receiptData.total,
      tax: receiptData.total * 0.15,
      discount: 0,
      total: receiptData.total * 1.15,
      paymentMethod: 'cash' as const,
      status: 'completed' as const,
    };

    dataManager.addSale(sale);

    alert('Payment successful! Stock updated.');
    setCart([]);
    setShowReceipt(false);
    setReceiptData(null);
    
    // Refresh products to show updated stock
    setProducts(dataManager.getProducts());
  };

  const handlePrintReceipt = () => {
    if (!receiptRef.current) return;
    
    // Get business settings from localStorage or use defaults
    const businessSettings = JSON.parse(
      localStorage.getItem('replenishhq_business_settings') || '{}'
    );

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print receipt');
      return;
    }

    const businessName = businessSettings.businessName || 'ReplenishHQ Store';
    const businessAddress = businessSettings.address || '';
    const businessPhone = businessSettings.phone || '';
    const businessEmail = businessSettings.email || '';

    const tax = receiptData ? receiptData.total * 0.15 : 0;
    const subtotal = receiptData ? receiptData.total : 0;
    const total = receiptData ? receiptData.total * 1.15 : 0;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${receiptData?.id || ''}</title>
          <style>
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 10px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
              }
            }
            body {
              margin: 0;
              padding: 10px;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              max-width: 300px;
            }
            .header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .business-name {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 5px;
            }
            .business-info {
              font-size: 10px;
              color: #666;
              margin: 2px 0;
            }
            .receipt-info {
              margin: 10px 0;
              font-size: 11px;
            }
            .receipt-info p {
              margin: 3px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }
            th {
              text-align: left;
              border-bottom: 1px solid #000;
              padding: 5px 0;
              font-size: 11px;
            }
            td {
              padding: 4px 0;
              font-size: 11px;
            }
            .text-right {
              text-align: right;
            }
            .totals {
              border-top: 1px dashed #000;
              padding-top: 10px;
              margin-top: 10px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .grand-total {
              font-weight: bold;
              font-size: 14px;
              border-top: 2px solid #000;
              padding-top: 5px;
              margin-top: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px dashed #000;
              font-size: 10px;
              color: #666;
            }
            .thank-you {
              text-align: center;
              margin-top: 15px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="business-name">${businessName}</div>
            ${businessAddress ? `<div class="business-info">${businessAddress}</div>` : ''}
            ${businessPhone ? `<div class="business-info">Tel: ${businessPhone}</div>` : ''}
            ${businessEmail ? `<div class="business-info">${businessEmail}</div>` : ''}
          </div>
          
          <div class="receipt-info">
            <p><strong>Receipt ID:</strong> ${receiptData?.id || ''}</p>
            <p><strong>Date:</strong> ${receiptData?.date || ''}</p>
            <p><strong>Time:</strong> ${receiptData?.time || ''}</p>
            ${selectedCustomer ? `<p><strong>Customer:</strong> ${selectedCustomer.name}</p>` : ''}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${receiptData?.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td class="text-right">${item.qty}</td>
                  <td class="text-right">${formatCurrency(item.price * item.qty)}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(subtotal)}</span>
            </div>
            <div class="total-row">
              <span>Tax (15%):</span>
              <span>${formatCurrency(tax)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total:</span>
              <span>${formatCurrency(total)}</span>
            </div>
          </div>
          
          <div class="thank-you">
            Thank you for your purchase!
          </div>
          
          <div class="footer">
            <p>This is a computer-generated receipt</p>
            <p>No signature required</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // Close the window after printing (optional)
      // printWindow.close();
    }, 250);
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

  const filteredProducts = products.filter(p => 
    p.stock > 0 && (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="lg:col-span-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Point of Sale</h1>
          <div className="relative">
            <button
              onClick={() => setShowCustomerSelect(!showCustomerSelect)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Users size={18} />
              {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
            </button>
            {showCustomerSelect && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setShowCustomerSelect(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b"
                >
                  Walk-in Customer
                </button>
                {customers.map((customer: Customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowCustomerSelect(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {customer.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
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
          <div ref={receiptRef} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Receipt</h2>
            <div className="border-b pb-4 mb-4 text-sm">
              <p><strong>Receipt ID:</strong> {receiptData.id}</p>
              <p><strong>Date:</strong> {receiptData.date}</p>
              <p><strong>Time:</strong> {receiptData.time}</p>
              {selectedCustomer && (
                <p><strong>Customer:</strong> {selectedCustomer.name}</p>
              )}
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
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(receiptData.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (15%):</span>
                  <span>{formatCurrency(receiptData.total * 0.15)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(receiptData.total * 1.15)}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={handlePrintReceipt}
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Print Receipt
              </button>
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

