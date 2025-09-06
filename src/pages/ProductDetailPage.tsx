import React from 'react';
import { ArrowLeft, ShoppingCart, User, Calendar, Tag } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

interface ProductDetailPageProps {
  product: Product;
  onNavigate: (page: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onNavigate }) => {
  const { addToCart } = useApp();
  const { user } = useAuth();

  const isOwner = user?.id === product.sellerId;

  const handleAddToCart = () => {
    addToCart(product);
    alert('Product added to cart!');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to listings</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                <Tag className="w-4 h-4" />
                <span>{product.category}</span>
              </span>
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Seller Information</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.sellerName}</p>
                <p className="text-sm text-gray-600">Trusted seller</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium text-gray-900">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Listed on</span>
                <span className="font-medium text-gray-900">
                  {formatDate(product.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last updated</span>
                <span className="font-medium text-gray-900">
                  {formatDate(product.updatedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Condition</span>
                <span className="font-medium text-gray-900">Pre-owned</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {!isOwner ? (
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center space-x-3 bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-center font-medium">
                  This is your listing
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Buyer protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose EcoFinds?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Shopping</h3>
            <p className="text-gray-600 text-sm">
              Safe and secure transactions with buyer protection
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Trusted Sellers</h3>
            <p className="text-gray-600 text-sm">
              All sellers are verified members of our community
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
            <p className="text-gray-600 text-sm">
              Items are as described or your money back
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;