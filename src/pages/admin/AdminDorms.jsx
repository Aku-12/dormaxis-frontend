import React, { useState, useEffect } from 'react';
import adminApi from '../../api/admin.api';

const AdminDorms = () => {
  const [dorms, setDorms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDorm, setEditingDorm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    beds: '',
    block: '',
    amenities: '',
    isPopular: false,
    rating: '',
    image: '',
  });

  useEffect(() => {
    fetchDorms();
  }, []);

  const fetchDorms = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllDorms(1, 100);
      if (response.success) {
        setDorms(response.data.dorms);
      }
    } catch (error) {
      console.error('Error fetching dorms:', error);
      alert('Failed to fetch dorms');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dorm = null) => {
    if (dorm) {
      setEditingDorm(dorm);
      setFormData({
        name: dorm.name,
        description: dorm.description,
        price: dorm.price,
        beds: dorm.beds,
        block: dorm.block,
        amenities: dorm.amenities.join(', '),
        isPopular: dorm.isPopular,
        rating: dorm.rating,
        image: dorm.image || '',
      });
    } else {
      setEditingDorm(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        beds: '',
        block: '',
        amenities: '',
        isPopular: false,
        rating: '',
        image: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDorm(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dormData = {
      ...formData,
      price: parseFloat(formData.price),
      beds: parseInt(formData.beds),
      rating: parseFloat(formData.rating) || 0,
      amenities: formData.amenities.split(',').map((item) => item.trim()).filter(Boolean),
    };

    try {
      let response;
      if (editingDorm) {
        response = await adminApi.updateDorm(editingDorm._id, dormData);
      } else {
        response = await adminApi.createDorm(dormData);
      }

      if (response.success) {
        alert(editingDorm ? 'Dorm updated successfully!' : 'Dorm created successfully!');
        handleCloseModal();
        fetchDorms();
      }
    } catch (error) {
      console.error('Error saving dorm:', error);
      alert('Failed to save dorm');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dorm?')) {
      return;
    }

    try {
      const response = await adminApi.deleteDorm(id);
      if (response.success) {
        alert('Dorm deleted successfully!');
        fetchDorms();
      }
    } catch (error) {
      console.error('Error deleting dorm:', error);
      alert('Failed to delete dorm');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90B8]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dorms Management</h1>
          <p className="text-gray-600">Manage all dorm listings</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-[#4A90B8] text-white rounded-lg font-semibold hover:bg-[#3A7A9A] transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Dorm
        </button>
      </div>

      {/* Dorms Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beds</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popular</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dorms.map((dorm) => (
                <tr key={dorm._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dorm.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dorm.block}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dorm.beds}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs. {dorm.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dorm.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dorm.isPopular ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(dorm)}
                      className="text-[#4A90B8] hover:text-[#3A7A9A] mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dorm._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingDorm ? 'Edit Dorm' : 'Add New Dorm'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Beds</label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Block</label>
                  <input
                    type="text"
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="WiFi, AC, Attached Bathroom"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8]"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#4A90B8] border-gray-300 rounded focus:ring-[#4A90B8]"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Mark as Popular</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#4A90B8] text-white rounded-lg font-semibold hover:bg-[#3A7A9A] transition-colors"
                >
                  {editingDorm ? 'Update Dorm' : 'Create Dorm'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDorms;
