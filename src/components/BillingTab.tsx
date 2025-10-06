import React from 'react';
import { Search, Plus, Minus, Printer, ShoppingCart, X } from 'lucide-react';
import { Product } from '../services/database';

interface BillingTabProps {
  products: Product[];
  cart: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  addToCart: (product: Product) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  calculateTotals: (items: any[]) => { subtotal: number; totalGST: number; totalAmount: number };
  processPayment: () => void;
}

export const BillingTab: React.FC<BillingTabProps> = ({
  products,
  cart,
  searchTerm,
  setSearchTerm,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  paymentMethod,
  setPaymentMethod,
  addToCart,
  updateQuantity,
  removeFromCart,
  calculateTotals,
  processPayment
}) => {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Search className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder="Search products by name, category or barcode..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900"
                onClick={() => addToCart(product)}
              >
                <h3 className="font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Category: {product.category}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Barcode: {product.barcode}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₹{product.price}</span>
                  <span className="text-sm text-green-600 dark:text-green-400">{product.gst}% GST</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
            <ShoppingCart className="mr-2 text-blue-500" size={20} />
            Shopping Cart
          </h2>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-800 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">₹{item.price} × {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium text-gray-800 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal:</span>
                  <span>₹{calculateTotals(cart).subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>GST:</span>
                  <span>₹{calculateTotals(cart).totalGST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-800 dark:text-white">
                  <span>Total:</span>
                  <span>₹{calculateTotals(cart).totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="font-bold mb-4 text-gray-800 dark:text-white">Customer Details</h3>
          <input
            type="text"
            placeholder="Customer Name"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />

          <h3 className="font-bold mb-3 text-gray-800 dark:text-white">Payment Method</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {['cash', 'card', 'upi', 'credit'].map(method => (
              <button
                key={method}
                className={`p-2 rounded-lg border transition-all ${
                  paymentMethod === method
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:shadow-sm'
                }`}
                onClick={() => setPaymentMethod(method)}
              >
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={processPayment}
            disabled={cart.length === 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg"
          >
            <Printer className="mr-2" size={20} />
            Process Payment (₹{calculateTotals(cart).totalAmount.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
};
