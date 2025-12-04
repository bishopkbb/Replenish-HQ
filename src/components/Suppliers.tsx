import React, { useState } from 'react';
import { Supplier } from '@/types';
import { MOCK_SUPPLIERS } from '@/utils/constants';
import { validateSupplier } from '@/utils/validation';

export const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddSupplier = () => {
    const validation = validateSupplier(formData);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);

    if (editingId) {
      setSuppliers(suppliers.map(s => s.id === editingId ? {
        ...s,
        ...formData,
      } : s));
      setEditingId(null);
    } else {
      const newSupplier: Supplier = {
        id: Math.max(...suppliers.map(s => s.id), 0) + 1,
        ...formData,
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    
    setFormData({ name: '', email: '', phone: '' });
    setShowModal(false);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
    });
    setEditingId(supplier.id);
    setShowModal(true);
    setErrors([]);
  };

  const handleDeleteSupplier = (id: number) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setEditingId(null);
    setShowModal(false);
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Suppliers</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          + Add Supplier
        </button>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <h3 className="font-semibold text-base sm:text-lg">{supplier.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">📧 {supplier.email}</p>
            <p className="text-xs sm:text-sm text-gray-600 truncate">📱 {supplier.phone}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEditSupplier(supplier)}
                className="text-blue-600 hover:underline text-xs sm:text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteSupplier(supplier.id)}
                className="text-red-600 hover:underline text-xs sm:text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Supplier' : 'Add New Supplier'}
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
              <input
                type="text"
                placeholder="Supplier Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddSupplier}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={resetForm}
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

