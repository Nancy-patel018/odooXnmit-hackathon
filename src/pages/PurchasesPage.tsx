import React from 'react';
import { Package, Calendar, DollarSign } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface PurchasesPageProps {
  onNavigate: (page: string) => void;
}

const PurchasesPage: React.FC<PurchasesPageProps> = ({ onNavigate }) => {
  const { purchases } = useApp();

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0);
  const thisMonthPurchases = purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.purchaseDate);
    const now = new Date();
    return purchaseDate.getMonth() === now.getMonth() && 
           purchaseDate.getFullYear() === now.getFullYear();
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase History</h1>
        <p className="text-gray-600">Track all your previous purchases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{thisMonthPurchases.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase List */}
      {purchases.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Purchases</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {purchases
              .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
              .map(purchase => (
                <div key={purchase.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img
                      src={purchase.product.imageUrl}
                      alt={purchase.product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {purchase.product.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Sold by {purchase.product.sellerName}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(purchase.purchaseDate)}</span>
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {purchase.product.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ${purchase.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Purchase #{purchase.id.slice(-6)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
          <p className="text-gray-600 mb-6">
            Start shopping to see your purchase history here
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>Start Shopping</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchasesPage;