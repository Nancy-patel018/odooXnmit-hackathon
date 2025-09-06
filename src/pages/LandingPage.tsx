import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, Product } from '../types';

const LandingPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  useEffect(() => {
    let result = products;
    if (search) {
      result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      result = result.filter(p => p.category === category);
    }
    setFiltered(result);
  }, [search, category, products]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="flex items-center justify-between w-full max-w-2xl px-6 py-4 bg-white shadow">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/cart')} className="relative">
            <span className="material-icons text-2xl">shopping_cart</span>
          </button>
        </div>
      </header>
      <main className="w-full max-w-2xl py-8">
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search ..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={() => {}}>
              Sort
            </button>
            <button className="px-3 py-1 border rounded" onClick={() => {}}>
              Filter
            </button>
            <button className="px-3 py-1 border rounded" onClick={() => {}}>
              Groupby
            </button>
          </div>
        </div>
        <div className="mb-6 flex justify-center">
          <img src="/banner.png" alt="Banner" className="w-full h-40 object-cover rounded-lg" />
        </div>
        <div className="mb-6">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <p className="col-span-3 text-center text-gray-500">No products found</p>
          ) : (
            filtered.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <img src={product.imageUrl} alt={product.title} className="w-32 h-32 object-cover rounded mb-2" />
                <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                <p className="text-green-600 font-semibold">${product.price}</p>
                <button
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
