'use client';

import { useState, useEffect } from 'react';
import { fetchProducts, updateProduct } from '@/lib/api';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts({ limit: 100 });
      setProducts(data.data?.items || []);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      await updateProduct(id, { stock: newStock });
      setProducts(products.map(p => p._id === id ? { ...p, stock: newStock } : p));
    } catch (error) {
      console.error('Failed to update stock', error);
      alert('Failed to update stock');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Low Stock Alert</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => {
                      const newStock = parseInt(e.target.value) || 0;
                      setProducts(products.map(p => p._id === product._id ? { ...p, stock: newStock } : p));
                    }}
                    className="w-20 border px-2 py-1 rounded"
                  />
                </td>
                <td className="px-4 py-2">{product.stock < 10 ? 'Low' : 'OK'}</td>
                <td className="px-4 py-2">
                  <button 
                    className="text-blue-500"
                    onClick={() => handleUpdateStock(product._id, product.stock)}
                  >
                    Update Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}