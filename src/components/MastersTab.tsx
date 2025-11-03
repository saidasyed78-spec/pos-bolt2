import React from 'react';
import { Search, Plus, CreditCard as Edit, Trash2, QrCode, Package, User, Tag, Percent, Save } from 'lucide-react';
import { Product, Supplier, Category, GstRate } from '../services/database';

interface MastersTabProps {
  mastersTab: string;
  setMastersTab: (tab: string) => void;
  products: Product[];
  suppliers: Supplier[];
  categories: Category[];
  gstRates: GstRate[];
  productSearchTerm: string;
  setProductSearchTerm: (term: string) => void;
  supplierSearchTerm: string;
  setSupplierSearchTerm: (term: string) => void;
  newProduct: any;
  setNewProduct: (product: any) => void;
  newSupplier: any;
  setNewSupplier: (supplier: any) => void;
  newCategory: string;
  setNewCategory: (category: string) => void;
  newGstRate: any;
  setNewGstRate: (rate: any) => void;
  editingProduct: any;
  setEditingProduct: (product: any) => void;
  editingSupplier: any;
  setEditingSupplier: (supplier: any) => void;
  editingCategory: any;
  setEditingCategory: (category: any) => void;
  editingGstRate: any;
  setEditingGstRate: (rate: any) => void;
  addProduct: () => void;
  updateProduct: () => void;
  deleteProduct: (id: string) => void;
  addSupplier: () => void;
  updateSupplier: () => void;
  deleteSupplier: (id: string) => void;
  addCategory: () => void;
  updateCategory: () => void;
  deleteCategory: (id: string) => void;
  addGstRate: () => void;
  updateGstRate: () => void;
  deleteGstRate: (id: string) => void;
  openLabelPrint: (product: Product) => void;
}

export const MastersTab: React.FC<MastersTabProps> = (props) => {
  const filteredProducts = props.products.filter(product =>
    product.name.toLowerCase().includes(props.productSearchTerm.toLowerCase()) ||
    product.barcode.includes(props.productSearchTerm) ||
    product.category.toLowerCase().includes(props.productSearchTerm.toLowerCase())
  );

  const filteredSuppliers = props.suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(props.supplierSearchTerm.toLowerCase()) ||
    supplier.gst_no.includes(props.supplierSearchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => props.setMastersTab('products')}
            className={`px-4 py-2 font-medium ${
              props.mastersTab === 'products'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => props.setMastersTab('suppliers')}
            className={`px-4 py-2 font-medium ${
              props.mastersTab === 'suppliers'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Ledger Master
          </button>
          <button
            onClick={() => props.setMastersTab('categories')}
            className={`px-4 py-2 font-medium ${
              props.mastersTab === 'categories'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => props.setMastersTab('gst')}
            className={`px-4 py-2 font-medium ${
              props.mastersTab === 'gst'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            GST Rates
          </button>
        </div>

        {props.mastersTab === 'products' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
                <Plus className="mr-2 text-blue-500" size={20} />
                Add New Product
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={props.newProduct.name}
                  onChange={(e) => props.setNewProduct({ ...props.newProduct, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Barcode"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={props.newProduct.barcode}
                  onChange={(e) => props.setNewProduct({ ...props.newProduct, barcode: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={props.newProduct.price}
                  onChange={(e) => props.setNewProduct({ ...props.newProduct, price: e.target.value })}
                />
                <select
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={props.newProduct.gst}
                  onChange={(e) => props.setNewProduct({ ...props.newProduct, gst: e.target.value })}
                >
                  <option value="">GST Rate</option>
                  {props.gstRates.map(rate => (
                    <option key={rate.id} value={rate.rate}>{rate.rate}% - {rate.description}</option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={props.newProduct.category}
                  onChange={(e) => props.setNewProduct({ ...props.newProduct, category: e.target.value })}
                >
                  <option value="">Category</option>
                  {props.categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Stock"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={props.newProduct.stock}
                  onChange={(e) => props.setNewProduct({ ...props.newProduct, stock: e.target.value })}
                />
              </div>
              <button
                onClick={props.addProduct}
                className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 flex items-center transition-all shadow-md"
              >
                <Save className="mr-2" size={16} />
                Add Product
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center text-gray-800 dark:text-white">
                  <Package className="mr-2 text-blue-500" size={20} />
                  Product Inventory
                </h2>
                <div className="flex items-center">
                  <Search className="text-gray-400 mr-2" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={props.productSearchTerm}
                    onChange={(e) => props.setProductSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Name</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Category</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Barcode</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Price</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">GST %</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Stock</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="p-3 text-gray-800 dark:text-white">{product.name}</td>
                        <td className="p-3 text-gray-800 dark:text-white">{product.category}</td>
                        <td className="p-3 text-gray-800 dark:text-white">{product.barcode}</td>
                        <td className="p-3 text-gray-800 dark:text-white">₹{product.price}</td>
                        <td className="p-3 text-gray-800 dark:text-white">{product.gst}%</td>
                        <td className="p-3 text-gray-800 dark:text-white">{product.stock}</td>
                        <td className="p-3 flex space-x-2">
                          <button
                            onClick={() => props.openLabelPrint(product)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Print Label"
                          >
                            <QrCode size={16} />
                          </button>
                          <button
                            onClick={() => props.setEditingProduct({ ...product })}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => props.deleteProduct(product.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {props.editingProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                  <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Edit Product</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Product Name"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={props.editingProduct.name}
                      onChange={(e) => props.setEditingProduct({ ...props.editingProduct, name: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Barcode"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={props.editingProduct.barcode}
                      onChange={(e) => props.setEditingProduct({ ...props.editingProduct, barcode: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={props.editingProduct.price}
                      onChange={(e) => props.setEditingProduct({ ...props.editingProduct, price: parseFloat(e.target.value) })}
                    />
                    <input
                      type="number"
                      placeholder="GST %"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={props.editingProduct.gst}
                      onChange={(e) => props.setEditingProduct({ ...props.editingProduct, gst: parseFloat(e.target.value) })}
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      value={props.editingProduct.stock}
                      onChange={(e) => props.setEditingProduct({ ...props.editingProduct, stock: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => props.setEditingProduct(null)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={props.updateProduct}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {props.mastersTab === 'suppliers' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-4 text-gray-800 dark:text-white">Add New Supplier</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Supplier Name"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={props.newSupplier.name}
                  onChange={(e) => props.setNewSupplier({ ...props.newSupplier, name: e.target.value })}
                />
                <textarea
                  placeholder="Address"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={props.newSupplier.address}
                  onChange={(e) => props.setNewSupplier({ ...props.newSupplier, address: e.target.value })}
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="GST Number"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={props.newSupplier.gst_no}
                  onChange={(e) => props.setNewSupplier({ ...props.newSupplier, gst_no: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={props.newSupplier.phone}
                  onChange={(e) => props.setNewSupplier({ ...props.newSupplier, phone: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Opening Balance"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={props.newSupplier.opening_balance}
                    onChange={(e) => props.setNewSupplier({ ...props.newSupplier, opening_balance: e.target.value })}
                  />
                  <select
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={props.newSupplier.balance_type}
                    onChange={(e) => props.setNewSupplier({ ...props.newSupplier, balance_type: e.target.value })}
                  >
                    <option value="Credit">Credit</option>
                    <option value="Debit">Debit</option>
                  </select>
                </div>
                <button
                  onClick={props.addSupplier}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 flex items-center justify-center transition-all shadow-md"
                >
                  <Plus className="mr-2" size={16} />
                  Add Supplier
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
                <User className="mr-2 text-blue-500" size={20} />
                Suppliers Ledger Master
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Name</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Phone</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Address</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">GST Number</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Opening Balance</th>
                      <th className="text-left p-3 text-gray-800 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map(supplier => (
                      <tr key={supplier.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="p-3 text-gray-800 dark:text-white">{supplier.name}</td>
                        <td className="p-3 text-gray-800 dark:text-white">{supplier.phone}</td>
                        <td className="p-3 text-gray-800 dark:text-white">{supplier.address}</td>
                        <td className="p-3 text-gray-800 dark:text-white">{supplier.gst_no}</td>
                        <td className="p-3 text-gray-800 dark:text-white">₹{supplier.opening_balance} ({supplier.balance_type})</td>
                        <td className="p-3 flex space-x-2">
                          <button
                            onClick={() => props.setEditingSupplier({ ...supplier })}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => props.deleteSupplier(supplier.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {props.mastersTab === 'categories' && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
              <Tag className="mr-2 text-blue-500" size={20} />
              Product Categories
            </h2>
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="New Category Name"
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={props.newCategory}
                onChange={(e) => props.setNewCategory(e.target.value)}
              />
              <button
                onClick={props.addCategory}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-r-lg hover:from-blue-600 hover:to-indigo-700 flex items-center transition-all"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left p-3 text-gray-800 dark:text-white">Category Name</th>
                    <th className="text-left p-3 text-gray-800 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {props.categories.map(category => (
                    <tr key={category.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="p-3 text-gray-800 dark:text-white">{category.name}</td>
                      <td className="p-3 flex space-x-2">
                        <button
                          onClick={() => props.deleteCategory(category.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {props.mastersTab === 'gst' && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
              <Percent className="mr-2 text-blue-500" size={20} />
              GST Rates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="number"
                placeholder="GST Rate (%)"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={props.newGstRate.rate}
                onChange={(e) => props.setNewGstRate({ ...props.newGstRate, rate: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={props.newGstRate.description}
                onChange={(e) => props.setNewGstRate({ ...props.newGstRate, description: e.target.value })}
              />
              <button
                onClick={props.addGstRate}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 flex items-center justify-center transition-all"
              >
                <Plus className="mr-2" size={16} />
                Add GST Rate
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left p-3 text-gray-800 dark:text-white">GST Rate (%)</th>
                    <th className="text-left p-3 text-gray-800 dark:text-white">Description</th>
                    <th className="text-left p-3 text-gray-800 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {props.gstRates.map(rate => (
                    <tr key={rate.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="p-3 text-gray-800 dark:text-white">{rate.rate}%</td>
                      <td className="p-3 text-gray-800 dark:text-white">{rate.description}</td>
                      <td className="p-3 flex space-x-2">
                        <button
                          onClick={() => props.deleteGstRate(rate.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
