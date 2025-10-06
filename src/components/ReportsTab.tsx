import React from 'react';
import { BarChart2, Download, PackagePlus, FileText } from 'lucide-react';

interface ReportsTabProps {
  salesReport: any[];
  purchaseReport: any[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  exportToExcel: (data: any[], filename: string) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  salesReport,
  purchaseReport,
  selectedDate,
  setSelectedDate,
  exportToExcel
}) => {
  const getDailySales = () => {
    return salesReport.filter(sale => sale.date === new Date(selectedDate).toLocaleDateString('en-IN'));
  };

  const allTransactions = [...salesReport.map(s => ({ ...s, type: 'sale' })), ...purchaseReport.map(p => ({ ...p, type: 'purchase' }))];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center text-gray-800 dark:text-white">
            <PackagePlus className="mr-2 text-blue-500" size={20} />
            Purchase Report
          </h2>
          <button
            onClick={() => exportToExcel(purchaseReport, 'purchase_report')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center transition-all shadow-md"
          >
            <Download className="mr-2" size={16} />
            Export to Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-3 text-gray-800 dark:text-white">Invoice #</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Date</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Supplier</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Items</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Subtotal</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">GST</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Total</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Payment</th>
              </tr>
            </thead>
            <tbody>
              {purchaseReport.map(purchase => (
                <tr key={purchase.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="p-3 text-gray-800 dark:text-white">#{purchase.invoice_number}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{purchase.date}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{purchase.supplier_name || 'Unknown Supplier'}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{purchase.items.length}</td>
                  <td className="p-3 text-gray-800 dark:text-white">₹{purchase.subtotal.toFixed(2)}</td>
                  <td className="p-3 text-gray-800 dark:text-white">₹{purchase.total_gst.toFixed(2)}</td>
                  <td className="p-3 font-bold text-gray-800 dark:text-white">₹{purchase.total_amount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      purchase.payment_method === 'cash' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      purchase.payment_method === 'card' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      purchase.payment_method === 'upi' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {purchase.payment_method.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center text-gray-800 dark:text-white">
            <BarChart2 className="mr-2 text-blue-500" size={20} />
            Sales Report
          </h2>
          <button
            onClick={() => exportToExcel(salesReport, 'sales_report')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center transition-all shadow-md"
          >
            <Download className="mr-2" size={16} />
            Export to Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-3 text-gray-800 dark:text-white">Invoice #</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Date</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Customer</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Items</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Subtotal</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">GST</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Total</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Payment</th>
              </tr>
            </thead>
            <tbody>
              {salesReport.map(sale => (
                <tr key={sale.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="p-3 text-gray-800 dark:text-white">#{sale.invoice_number}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{sale.date}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{sale.customer_name || 'Walk-in Customer'}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{sale.items.length}</td>
                  <td className="p-3 text-gray-800 dark:text-white">₹{sale.subtotal.toFixed(2)}</td>
                  <td className="p-3 text-gray-800 dark:text-white">₹{sale.total_gst.toFixed(2)}</td>
                  <td className="p-3 font-bold text-gray-800 dark:text-white">₹{sale.total_amount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      sale.payment_method === 'cash' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      sale.payment_method === 'card' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      sale.payment_method === 'upi' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {sale.payment_method.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center text-gray-800 dark:text-white">
            <FileText className="mr-2 text-blue-500" size={20} />
            Day Book
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="date"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button
              onClick={() => exportToExcel(getDailySales(), `day_book_${selectedDate}`)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center transition-all shadow-md"
            >
              <Download className="mr-2" size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-3 text-gray-800 dark:text-white">Time</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Invoice #</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Type</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Party</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Items</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Amount</th>
                <th className="text-left p-3 text-gray-800 dark:text-white">Payment</th>
              </tr>
            </thead>
            <tbody>
              {getDailySales().map(transaction => (
                <tr key={transaction.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="p-3 text-gray-800 dark:text-white">{transaction.time}</td>
                  <td className="p-3 text-gray-800 dark:text-white">#{transaction.invoice_number}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Sale
                    </span>
                  </td>
                  <td className="p-3 text-gray-800 dark:text-white">{transaction.customer_name || 'Walk-in Customer'}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{transaction.items.length}</td>
                  <td className="p-3 font-bold text-gray-800 dark:text-white">₹{transaction.total_amount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.payment_method === 'cash' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      transaction.payment_method === 'card' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      transaction.payment_method === 'upi' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {transaction.payment_method.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
