import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onClick?: (product: Product) => void;
  showActions?: boolean;
  isOwner?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  onClick,
  showActions = true,
  isOwner = false
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div 
        className="cursor-pointer"
        onClick={() => onClick?.(product)}
      >
        <div className="aspect-w-16 aspect-h-12 bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {product.title}
            </h3>
            <span className="text-lg font-bold text-green-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
            <span className="text-xs text-gray-500">
              by {product.sellerName}
            </span>
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="px-4 pb-4">
          {isOwner ? (
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(product);
                }}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(product.id);
                }}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;