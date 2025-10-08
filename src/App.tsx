import React, { useState, useEffect } from 'react';
import { ShoppingCart, PackagePlus, User, BarChart2, Settings, Store, UserCircle, Moon, Sun, Printer, QrCode } from 'lucide-react';
import { db, Product, Supplier, Category, GstRate } from './services/database';
import { BillingTab } from './components/BillingTab';
import { MastersTab } from './components/MastersTab';
import { ReportsTab } from './components/ReportsTab';

const App = () => {
  const [activeTab, setActiveTab] = useState('billing');
  const [theme, setTheme] = useState('light');
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [gstRates, setGstRates] = useState<GstRate[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [purchaseCart, setPurchaseCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [purchaseSearchTerm, setPurchaseSearchTerm] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(1001);
  const [purchaseInvoiceNumber, setPurchaseInvoiceNumber] = useState(2001);
  const [customerName, setCustomerName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [purchasePaymentMethod, setPurchasePaymentMethod] = useState('cash');
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPurchaseInvoice, setShowPurchaseInvoice] = useState(false);
  const [salesReport, setSalesReport] = useState<any[]>([]);
  const [purchaseReport, setPurchaseReport] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newProduct, setNewProduct] = useState({ name: '', barcode: '', price: '', gst: 18, stock: '', category: '' });
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showLabelPrint, setShowLabelPrint] = useState(false);
  const [selectedProductForLabel, setSelectedProductForLabel] = useState<any>(null);
  const [labelQuantity, setLabelQuantity] = useState(1);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newGstRate, setNewGstRate] = useState({ rate: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingGstRate, setEditingGstRate] = useState<any>(null);
  const [newSupplier, setNewSupplier] = useState({ name: '', address: '', gst_no: '', opening_balance: '', balance_type: 'Credit' });
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [shopProfile, setShopProfile] = useState({
    shopName: 'SHREE GANESH TRADERS',
    ownerName: 'Rajesh Kumar',
    address: '123 Main Street, Mumbai, Maharashtra',
    phone: '9876543210',
    email: 'info@shreeganeshtraders.com',
    gstin: '27AABCCDDEEFFG'
  });
  const [mastersTab, setMastersTab] = useState('products');
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [currentPurchaseInvoice, setCurrentPurchaseInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settingsTab, setSettingsTab] = useState('theme');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, suppliersData, categoriesData, gstRatesData, salesData, purchasesData, nextSaleInvoice, nextPurchaseInvoice] = await Promise.all([
        db.products.getAll(),
        db.suppliers.getAll(),
        db.categories.getAll(),
        db.gstRates.getAll(),
        db.sales.getAll(),
        db.purchases.getAll(),
        db.sales.getNextInvoiceNumber(),
        db.purchases.getNextInvoiceNumber()
      ]);

      setProducts(productsData);
      setSuppliers(suppliersData);
      setCategories(categoriesData);
      setGstRates(gstRatesData);
      setSalesReport(salesData);
      setPurchaseReport(purchasesData);
      setInvoiceNumber(nextSaleInvoice);
      setPurchaseInvoiceNumber(nextPurchaseInvoice);

      if (categoriesData.length > 0 && !newProduct.category) {
        setNewProduct(prev => ({ ...prev, category: categoriesData[0].name }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotals = (items: any[]) => {
    let subtotal = 0;
    let totalGST = 0;
    let totalAmount = 0;

    items.forEach(item => {
      const itemTotal = (item.purchasePrice || item.price) * item.quantity;
      const gstAmount = (itemTotal * item.gst) / 100;
      subtotal += itemTotal;
      totalGST += gstAmount;
      totalAmount += itemTotal + gstAmount;
    });

    return { subtotal, totalGST, totalAmount };
  };

  const processPayment = async () => {
    if (cart.length === 0) return;

    try {
      const { subtotal, totalGST, totalAmount } = calculateTotals(cart);
      const sale = {
        invoice_number: invoiceNumber,
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN'),
        customer_name: customerName,
        customer_phone: customerPhone,
        items: cart,
        subtotal,
        total_gst: totalGST,
        total_amount: totalAmount,
        payment_method: paymentMethod
      };

      const createdSale = await db.sales.create(sale);
      setSalesReport([createdSale, ...salesReport]);
      setInvoiceNumber(invoiceNumber + 1);
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setShowInvoice(true);
      setCurrentInvoice(createdSale);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
    }
  };

  const addProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.gst && newProduct.category) {
      try {
        const product = {
          name: newProduct.name,
          barcode: newProduct.barcode,
          price: parseFloat(newProduct.price),
          gst: parseFloat(String(newProduct.gst)),
          stock: parseInt(newProduct.stock) || 0,
          category: newProduct.category
        };

        await db.products.create(product);
        await loadData();
        setNewProduct({ name: '', barcode: '', price: '', gst: 18, stock: '', category: newProduct.category });
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Error adding product. Please try again.');
      }
    }
  };

  const updateProduct = async () => {
    if (editingProduct) {
      try {
        await db.products.update(editingProduct.id, editingProduct);
        await loadData();
        setEditingProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Error updating product. Please try again.');
      }
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await db.products.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const addSupplier = async () => {
    if (newSupplier.name && newSupplier.address) {
      try {
        const supplier = {
          name: newSupplier.name,
          address: newSupplier.address,
          gst_no: newSupplier.gst_no,
          opening_balance: parseFloat(newSupplier.opening_balance) || 0,
          balance_type: newSupplier.balance_type
        };

        await db.suppliers.create(supplier);
        await loadData();
        setNewSupplier({ name: '', address: '', gst_no: '', opening_balance: '', balance_type: 'Credit' });
      } catch (error) {
        console.error('Error adding supplier:', error);
        alert('Error adding supplier. Please try again.');
      }
    }
  };

  const updateSupplier = async () => {
    if (editingSupplier) {
      try {
        await db.suppliers.update(editingSupplier.id, editingSupplier);
        await loadData();
        setEditingSupplier(null);
      } catch (error) {
        console.error('Error updating supplier:', error);
        alert('Error updating supplier. Please try again.');
      }
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await db.suppliers.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      alert('Error deleting supplier. Please try again.');
    }
  };

  const addCategory = async () => {
    if (newCategory.trim()) {
      try {
        await db.categories.create({ name: newCategory.trim() });
        await loadData();
        setNewCategory('');
      } catch (error) {
        console.error('Error adding category:', error);
        alert('Error adding category. Please try again.');
      }
    }
  };

  const updateCategory = async () => {
    if (editingCategory) {
      try {
        await db.categories.update(editingCategory.id, editingCategory);
        await loadData();
        setEditingCategory(null);
      } catch (error) {
        console.error('Error updating category:', error);
        alert('Error updating category. Please try again.');
      }
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await db.categories.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };

  const addGstRate = async () => {
    if (newGstRate.rate && newGstRate.description.trim()) {
      try {
        await db.gstRates.create({
          rate: parseFloat(newGstRate.rate),
          description: newGstRate.description.trim()
        });
        await loadData();
        setNewGstRate({ rate: '', description: '' });
      } catch (error) {
        console.error('Error adding GST rate:', error);
        alert('Error adding GST rate. Please try again.');
      }
    }
  };

  const updateGstRate = async () => {
    if (editingGstRate) {
      try {
        await db.gstRates.update(editingGstRate.id, editingGstRate);
        await loadData();
        setEditingGstRate(null);
      } catch (error) {
        console.error('Error updating GST rate:', error);
        alert('Error updating GST rate. Please try again.');
      }
    }
  };

  const deleteGstRate = async (id: string) => {
    try {
      await db.gstRates.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting GST rate:', error);
      alert('Error deleting GST rate. Please try again.');
    }
  };

  const exportToExcel = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8,"
      + Object.keys(data[0]).join(",") + "\n"
      + data.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openLabelPrint = (product: Product) => {
    setSelectedProductForLabel(product);
    setLabelQuantity(1);
    setShowLabelPrint(true);
  };

  const printLabels = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Product Labels</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          .label-container {
            width: 50mm; height: 25mm; display: flex; flex-direction: column;
            justify-content: center; align-items: center; text-align: center;
            border: 1px solid #000; box-sizing: border-box; padding: 2mm;
          }
          .company-name { font-size: 7pt; font-weight: bold; margin-bottom: 1mm; line-height: 1.1; }
          .product-name { font-size: 8pt; font-weight: bold; margin-bottom: 2mm; line-height: 1.2; max-height: 20px; overflow: hidden; }
          .barcode-container { margin: 1mm 0; width: 100%; }
          .barcode-bars { height: 25px; margin-bottom: 2mm; width: 100%; }
          .sale-rate { font-size: 12pt; font-weight: bold; margin-top: 1mm; }
          @media print {
            @page { size: 50mm 25mm; margin: 0; }
            body { margin: 0; padding: 0; }
          }
        </style>
      </head>
      <body>
    `);

    for (let i = 0; i < labelQuantity; i++) {
      printWindow.document.write(`
        <div class="label-container">
          <div class="company-name">${shopProfile.shopName}</div>
          <div class="product-name">${selectedProductForLabel.name}</div>
          <div class="barcode-container">
            <img src="https://barcode.tec-it.com/barcode.ashx?data=${selectedProductForLabel.barcode}&code=Code128&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0" alt="Barcode" class="barcode-bars">
          </div>
          <div class="sale-rate">₹${selectedProductForLabel.price}</div>
        </div>
      `);
    }

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const renderInvoice = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md max-h-screen overflow-y-auto shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{shopProfile.shopName}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{shopProfile.address}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">GSTIN: {shopProfile.gstin}</p>
          <div className="border-t border-gray-300 dark:border-gray-700 my-3"></div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Invoice #{currentInvoice?.invoice_number}</span>
            <span>{currentInvoice?.date} {currentInvoice?.time}</span>
          </div>
          {currentInvoice?.customer_name && (
            <div className="text-sm mt-2 text-gray-800 dark:text-white">
              <p>Customer: {currentInvoice.customer_name}</p>
              {currentInvoice.customer_phone && <p>Phone: {currentInvoice.customer_phone}</p>}
            </div>
          )}
        </div>

        <div className="mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="text-left pb-1 text-gray-800 dark:text-white">Item</th>
                <th className="text-right pb-1 text-gray-800 dark:text-white">Qty</th>
                <th className="text-right pb-1 text-gray-800 dark:text-white">Rate</th>
                <th className="text-right pb-1 text-gray-800 dark:text-white">Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentInvoice?.items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-1">
                    <div className="font-medium text-gray-800 dark:text-white">{item.name}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">GST {item.gst}%</div>
                  </td>
                  <td className="text-right py-1 text-gray-800 dark:text-white">{item.quantity}</td>
                  <td className="text-right py-1 text-gray-800 dark:text-white">₹{item.price.toFixed(2)}</td>
                  <td className="text-right py-1 text-gray-800 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 pt-2">
          <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-300">
            <span>Subtotal:</span>
            <span>₹{currentInvoice?.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-300">
            <span>GST:</span>
            <span>₹{currentInvoice?.total_gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 text-gray-800 dark:text-white">
            <span>Total:</span>
            <span>₹{currentInvoice?.total_amount.toFixed(2)}</span>
          </div>
          <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            <p>Payment Method: {currentInvoice?.payment_method.toUpperCase()}</p>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-gray-600 dark:text-gray-400">
          <p>Thank you for shopping with us!</p>
        </div>

        <div className="flex justify-center space-x-3 mt-6">
          <button
            onClick={() => window.print()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 flex items-center transition-all shadow-md"
          >
            <Printer className="mr-2" size={16} />
            Print
          </button>
          <button
            onClick={() => setShowInvoice(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const renderLabelPrint = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
        <h3 className="text-lg font-bold mb-4 flex items-center text-gray-800 dark:text-white">
          <QrCode className="mr-2 text-blue-500" size={20} />
          Print Product Labels
        </h3>

        {selectedProductForLabel && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-800 dark:text-white">{selectedProductForLabel.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Barcode: {selectedProductForLabel.barcode}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Price: ₹{selectedProductForLabel.price}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Number of Labels</label>
          <input
            type="number"
            min="1"
            max="100"
            value={labelQuantity}
            onChange={(e) => setLabelQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowLabelPrint(false)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={printLabels}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 flex items-center transition-all shadow-md"
          >
            <Printer className="mr-2" size={16} />
            Print Labels
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Store className="text-purple-500 mr-3" size={32} />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Easy-Retail</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <UserCircle className="mr-2" size={18} />
                {shopProfile.ownerName}
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-2">
            {[
              { id: 'billing', label: 'Billing', icon: ShoppingCart },
              { id: 'purchase', label: 'Purchase', icon: PackagePlus },
              { id: 'masters', label: 'Masters', icon: User },
              { id: 'reports', label: 'Reports', icon: BarChart2 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <tab.icon className="mr-2" size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'billing' && (
          <BillingTab
            products={products}
            cart={cart}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            calculateTotals={calculateTotals}
            processPayment={processPayment}
          />
        )}

        {activeTab === 'purchase' && (
          <div className="text-center text-gray-600 dark:text-gray-300">
            Purchase module - Coming soon
          </div>
        )}

        {activeTab === 'masters' && (
          <MastersTab
            mastersTab={mastersTab}
            setMastersTab={setMastersTab}
            products={products}
            suppliers={suppliers}
            categories={categories}
            gstRates={gstRates}
            productSearchTerm={productSearchTerm}
            setProductSearchTerm={setProductSearchTerm}
            supplierSearchTerm={supplierSearchTerm}
            setSupplierSearchTerm={setSupplierSearchTerm}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            newSupplier={newSupplier}
            setNewSupplier={setNewSupplier}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            newGstRate={newGstRate}
            setNewGstRate={setNewGstRate}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            editingSupplier={editingSupplier}
            setEditingSupplier={setEditingSupplier}
            editingCategory={editingCategory}
            setEditingCategory={setEditingCategory}
            editingGstRate={editingGstRate}
            setEditingGstRate={setEditingGstRate}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addSupplier={addSupplier}
            updateSupplier={updateSupplier}
            deleteSupplier={deleteSupplier}
            addCategory={addCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
            addGstRate={addGstRate}
            updateGstRate={updateGstRate}
            deleteGstRate={deleteGstRate}
            openLabelPrint={openLabelPrint}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            salesReport={salesReport}
            purchaseReport={purchaseReport}
            products={products}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            exportToExcel={exportToExcel}
          />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  onClick={() => setSettingsTab('theme')}
                  className={`px-4 py-2 font-medium ${
                    settingsTab === 'theme'
                      ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Theme
                </button>
                <button
                  onClick={() => setSettingsTab('profile')}
                  className={`px-4 py-2 font-medium ${
                    settingsTab === 'profile'
                      ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Shop Profile
                </button>
              </div>

              {settingsTab === 'theme' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Select Theme</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => setTheme('light')}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${
                        theme === 'light'
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 shadow-lg'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <Sun className="text-yellow-500 mr-3" size={28} />
                        <h4 className="font-bold text-gray-800 dark:text-white text-lg">Light Theme</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Bright and clean interface with white backgrounds</p>
                      <div className="mt-4 flex space-x-2">
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-300"></div>
                        <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                      </div>
                    </div>
                    <div
                      onClick={() => setTheme('dark')}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all transform hover:scale-105 ${
                        theme === 'dark'
                          ? 'border-purple-500 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <Moon className="text-indigo-400 mr-3" size={28} />
                        <h4 className="font-bold text-gray-800 dark:text-white text-lg">Dark Theme</h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Easy on the eyes with dark backgrounds</p>
                      <div className="mt-4 flex space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700"></div>
                        <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                        <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Shop Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shop Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        value={shopProfile.shopName}
                        onChange={(e) => setShopProfile({ ...shopProfile, shopName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Owner Name</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        value={shopProfile.ownerName}
                        onChange={(e) => setShopProfile({ ...shopProfile, ownerName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                      <textarea
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        rows={3}
                        value={shopProfile.address}
                        onChange={(e) => setShopProfile({ ...shopProfile, address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          value={shopProfile.phone}
                          onChange={(e) => setShopProfile({ ...shopProfile, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          value={shopProfile.email}
                          onChange={(e) => setShopProfile({ ...shopProfile, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GSTIN</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        value={shopProfile.gstin}
                        onChange={(e) => setShopProfile({ ...shopProfile, gstin: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={() => alert('Shop profile updated successfully!')}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-700 flex items-center transition-all shadow-md"
                    >
                      <Store className="mr-2" size={16} />
                      Update Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {showInvoice && renderInvoice()}
      {showLabelPrint && renderLabelPrint()}
    </div>
  );
};

export default App;
