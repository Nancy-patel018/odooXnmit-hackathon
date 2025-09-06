import React, { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { CATEGORIES, Product } from '../types';

interface AddProductPageProps {
  onNavigate: (page: string) => void;
  editProduct?: Product | null;
}

const AddProductPage: React.FC<AddProductPageProps> = ({ onNavigate, editProduct }) => {
  // Removed unused context destructuring
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasImageSelected, setHasImageSelected] = useState(false);

  // Sample image URLs for demo purposes
  const sampleImages = [
    'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1598300/pexels-photo-1598300.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  useEffect(() => {
    if (editProduct) {
      setFormData({
        title: editProduct.title,
        description: editProduct.description,
        price: editProduct.price.toString(),
        category: CATEGORIES.includes(editProduct.category as any) ? editProduct.category : CATEGORIES[0],
        imageUrl: editProduct.imageUrl
      });
      setHasImageSelected(!!editProduct.imageUrl);
    }
  }, [editProduct]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    // Block local file path usage for imageUrl
    if (!formData.imageUrl.trim() && !imageFile) {
      newErrors.imageUrl = 'Please select an image or upload a file.';
    } else if (formData.imageUrl.trim().startsWith('file:')) {
      newErrors.imageUrl = 'Local file paths are not allowed. Please upload an image or use a valid URL.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      // Prevent local file path usage for imageUrl
      if (formData.imageUrl && formData.imageUrl.startsWith('file:')) {
        setErrors(prev => ({ ...prev, imageUrl: 'Please upload an image or use a valid URL.' }));
        setIsSubmitting(false);
        return;
      }
      // Prepare form data for backend
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('price', formData.price);
      data.append('category', formData.category);
      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.imageUrl) {
        data.append('imageUrl', formData.imageUrl);
      }
      // Use backend server URL
      const url = editProduct
        ? `http://localhost:5000/api/products/${editProduct.id}`
        : 'http://localhost:5000/api/products';
      const method = editProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        body: data,
      });
      if (!res.ok) throw new Error('Failed to save product');
      onNavigate('my-listings');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (field === 'imageUrl' && value) {
      setHasImageSelected(true);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setImageFile(null);
    setHasImageSelected(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => onNavigate('my-listings')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 ml-6">
          {editProduct ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter product title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe your product..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image *
            </label>
            <div className="space-y-4">
              {/* File Upload Option */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                      setHasImageSelected(true);
                      handleInputChange('imageUrl', '');
                    }
                  }}
                  className="mb-2"
                />
                {imageFile && (
                  <div className="relative inline-block">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Selected"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {/* Current Selection (URL) */}
              {formData.imageUrl && !imageFile && (
                <div className="relative inline-block">
                  <img
                    src={formData.imageUrl}
                    alt="Selected"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {/* Image Options - Only show if no image selected */}
              {!hasImageSelected && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Choose from sample images:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {sampleImages.map((imageUrl, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            handleInputChange('imageUrl', imageUrl);
                            setImageFile(null);
                            setHasImageSelected(true);
                          }}
                          className={`relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                            formData.imageUrl === imageUrl && !imageFile
                              ? 'border-green-500 ring-2 ring-green-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={imageUrl}
                            alt={`Option ${index + 1}`}
                            className="w-full h-20 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Custom URL Input */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Or enter image URL:</p>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={e => {
                        handleInputChange('imageUrl', e.target.value);
                        setImageFile(null);
                        if (e.target.value) {
                          setHasImageSelected(true);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              )}
            </div>
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => onNavigate('my-listings')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (editProduct ? 'Update Product' : 'List Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;