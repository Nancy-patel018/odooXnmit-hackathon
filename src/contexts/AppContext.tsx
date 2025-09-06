import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Purchase } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  purchases: Purchase[];
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  purchaseCartItems: () => void;
  getUserProducts: (userId: string) => Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

// Sample products for demo
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Genuine leather jacket in excellent condition. Perfect for casual wear.',
    price: 89.99,
    category: 'Clothing',
    imageUrl: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400',
    sellerId: 'demo-seller-1',
    sellerName: 'John Doe',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'iPhone 12 Pro',
    description: 'Unlocked iPhone 12 Pro in great condition. Includes charger and case.',
    price: 599.99,
    category: 'Electronics',
    imageUrl: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    sellerId: 'demo-seller-2',
    sellerName: 'Jane Smith',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '3',
    title: 'Wooden Coffee Table',
    description: 'Beautiful handcrafted wooden coffee table. Minor scratches but very sturdy.',
    price: 150.00,
    category: 'Furniture',
    imageUrl: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
    sellerId: 'demo-seller-3',
    sellerName: 'Mike Johnson',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: '4',
    title: 'Mountain Bike',
    description: 'Trek mountain bike in good condition. Perfect for weekend adventures.',
    price: 320.00,
    category: 'Sports',
    imageUrl: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400',
    sellerId: 'demo-seller-4',
    sellerName: 'Sarah Wilson',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
];

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    // Load data from localStorage or use sample data
    const storedProducts = localStorage.getItem('ecofinds_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(sampleProducts);
      localStorage.setItem('ecofinds_products', JSON.stringify(sampleProducts));
    }

    if (user) {
      const storedCart = localStorage.getItem(`ecofinds_cart_${user.id}`);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      const storedPurchases = localStorage.getItem(`ecofinds_purchases_${user.id}`);
      if (storedPurchases) {
        setPurchases(JSON.parse(storedPurchases));
      }
    }
  }, [user]);

  const addProduct = (productData: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      sellerId: user.id,
      sellerName: user.username,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('ecofinds_products', JSON.stringify(updatedProducts));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, ...updates, updatedAt: new Date() } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('ecofinds_products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('ecofinds_products', JSON.stringify(updatedProducts));
  };

  const addToCart = (product: Product) => {
    if (!user) return;

    const existingItem = cart.find(item => item.product.id === product.id);
    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      const newCartItem: CartItem = {
        id: Date.now().toString(),
        product,
        quantity: 1,
        addedAt: new Date()
      };
      updatedCart = [...cart, newCartItem];
    }

    setCart(updatedCart);
    localStorage.setItem(`ecofinds_cart_${user.id}`, JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: string) => {
    if (!user) return;

    const updatedCart = cart.filter(item => item.product.id !== productId);
    setCart(updatedCart);
    localStorage.setItem(`ecofinds_cart_${user.id}`, JSON.stringify(updatedCart));
  };

  const purchaseCartItems = () => {
    if (!user || cart.length === 0) return;

    const newPurchases: Purchase[] = cart.map(item => ({
      id: Date.now().toString() + Math.random(),
      product: item.product,
      purchaseDate: new Date(),
      price: item.product.price
    }));

    const updatedPurchases = [...purchases, ...newPurchases];
    setPurchases(updatedPurchases);
    localStorage.setItem(`ecofinds_purchases_${user.id}`, JSON.stringify(updatedPurchases));

    // Clear cart
    setCart([]);
    localStorage.removeItem(`ecofinds_cart_${user.id}`);
  };

  const getUserProducts = (userId: string) => {
    return products.filter(product => product.sellerId === userId);
  };

  const value = {
    products,
    cart,
    purchases,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    purchaseCartItems,
    getUserProducts
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};