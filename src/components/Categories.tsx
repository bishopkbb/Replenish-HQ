import React, { useState } from 'react';
import { Category } from '@/types';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', productCount: 2 },
  { id: 2, name: 'Accessories', description: 'Computer and device accessories', productCount: 3 },
  { id: 3, name: 'Other', description: 'Miscellaneous items', productCount: 0 },
];

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddCategory = () => {
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push('Category name is required');
    if (categories.some(c => c.name.toLowerCase() === formData.name.toLowerCase() && c.id !== editingId)) {
      newErrors.push('Category name already exists');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingId) {
      setCategories(categories.map(c => 
        c.id === editingId 
          ? { ...c, name: formData.name, description: formData.description }
          : c
      ));
      setEditingId(null);
    } else {
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        name: formData.name.trim(),
        description: formData.description.trim(),
        productCount: 0,
      };
      setCategories([...categories, newCategory]);
    }

    setFormData({ name: '', description: '' });
    setShowModal(false);
    setErrors([]);
  };

  const handleEditCategory = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setEditingId(category.id);
    setShowModal(true);
    setErrors([]);
  };

  const handleDeleteCategory = (id: number) => {
    const category = categories.find(c => c.id === id);
    if (category && category.productCount > 0) {
      alert('Cannot delete category with products. Please reassign products first.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', description: '' });
            setShowModal(true);
          }}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex items-center gap-2 justify-center"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category.id} className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.productCount} products</p>
                </div>
              </div>
            </div>
            {category.description && (
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEditCategory(category)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                disabled={category.productCount > 0}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                <ul className="list-disc list-inside">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <textarea
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddCategory}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Category
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormData({ name: '', description: '' });
                  setEditingId(null);
                  setErrors([]);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

