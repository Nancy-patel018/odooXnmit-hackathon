import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { Product } from './types';

// Components
import LoginForm from './components/LoginForm';
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import AddProductPage from './pages/AddProductPage';
import MyListingsPage from './pages/MyListingsPage';
import CartPage from './pages/CartPage';
import PurchasesPage from './pages/PurchasesPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetailPage from './pages/ProductDetailPage';

type Page = 'home' | 'add-product' | 'my-listings' | 'cart' | 'purchases' | 'profile' | 'product-detail';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    if (page !== 'add-product') {
      setEditingProduct(null);
    }
    if (page !== 'product-detail') {
      setSelectedProduct(null);
    }
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setCurrentPage('add-product');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
          />
        );
      case 'add-product':
        return (
          <AddProductPage 
            onNavigate={handleNavigate}
            editProduct={editingProduct}
          />
        );
      case 'my-listings':
        return (
          <MyListingsPage 
            onNavigate={handleNavigate}
            onEditProduct={handleEditProduct}
            onViewProduct={handleViewProduct}
          />
        );
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'purchases':
        return <PurchasesPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage />;
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetailPage 
            product={selectedProduct}
            onNavigate={handleNavigate}
          />
        ) : (
          <HomePage 
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
          />
        );
      default:
        return (
          <HomePage 
            onNavigate={handleNavigate}
            onViewProduct={handleViewProduct}
          />
        );
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;