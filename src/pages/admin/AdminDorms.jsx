import React, { useState, useEffect } from 'react';
import adminApi from '../../api/admin.api';
import { API_CONFIG } from '../../config/api.config';
import { useToast } from '../../components/common/Toast';

const AdminDorms = () => {
  const [dorms, setDorms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDorm, setEditingDorm] = useState(null);
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    beds: '',
    block: '',
    amenities: '',
    isPopular: false,
    rating: '',
    images: [],
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
      toast.error('Failed to fetch dorms');
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
        amenities: dorm.amenities.join(', '), // Convert array to comma-separated string
        isPopular: dorm.isPopular,
        rating: dorm.rating,
        images: calculateImages(dorm)
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
        images: [],
      });
    }
    setShowModal(true);
  };
   

   // Helper function to extract images from dorm object
   const calculateImages = (dorm) => {
      let imgs = [];
      if(dorm.image) imgs.push(dorm.image);
      if(dorm.images && dorm.images.length > 0) imgs = [...imgs, ...dorm.images];
      // dedup
      return [...new Set(imgs)];
   }


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
        await adminApi.updateDorm(editingDorm._id, dormData);
      } else {
        await adminApi.createDorm(dormData);
      }
      
      toast.success(editingDorm ? 'Dorm updated successfully!' : 'Dorm created successfully!');
      handleCloseModal();
      fetchDorms();
    } catch (error) {
      console.error('Error saving dorm:', error);
      toast.error('Failed to save dorm');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dorm?')) {
      return;
    }

    try {
      await adminApi.deleteDorm(id);
      toast.success('Dorm deleted successfully!');
      fetchDorms();
    } catch (error) {
      console.error('Error deleting dorm:', error);
      toast.error('Failed to delete dorm');
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Dorm Images (Max 5)</label>
                <div className="space-y-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          if (files.length + formData.images.length > 5) {
                            toast.info('You can only have up to 5 images total.');
                            return;
                          }

                          const uploadData = new FormData();
                          for (let i = 0; i < files.length; i++) {
                            uploadData.append('images', files[i]);
                          }
                          
                          try {
                            const result = await adminApi.uploadDormImages(uploadData);
                            if (result.success) {
                              setFormData(prev => ({ 
                                ...prev, 
                                images: [...prev.images, ...result.data.imagePaths] 
                              }));
                              toast.success('Images uploaded successfully!');
                            }
                          } catch (error) {
                            console.error('Error uploading images:', error);
                            toast.error('Failed to upload images');
                          }
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, WEBP (Max 10MB per file). Select multiple files at once.</p>
                  </div>
                  
                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 relative group">
                          <img 
                            src={img.startsWith('http') ? img : `${API_CONFIG.BASE_URL.replace('/api', '')}${img}`} 
                            alt={`Preview ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150?text=No+Image'; 
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              images: prev.images.filter((_, i) => i !== index) 
                            }))}
                            className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          {index === 0 && (
                             <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-0.5">Main</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['WiFi', 'Air Conditioning', 'Parking', 'Laundry', 'Furnished', 'Kitchen', 'TV', 'Gym', 'Study Table', 'Attached Bathroom', 'Hot Water', 'Balcony', 'Security', 'CCTV', 'Wardrobe', 'Power Backup'].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.amenities.split(',').map(a => a.trim()).includes(amenity)}
                        onChange={(e) => {
                          const currentAmenities = formData.amenities ? formData.amenities.split(',').map(a => a.trim()).filter(Boolean) : [];
                          let newAmenities;
                          if (e.target.checked) {
                            newAmenities = [...currentAmenities, amenity];
                          } else {
                            newAmenities = currentAmenities.filter(a => a !== amenity);
                          }
                          setFormData(prev => ({ ...prev, amenities: newAmenities.join(', ') }));
                        }}
                        className="w-4 h-4 text-[#4A90B8] border-gray-300 rounded focus:ring-[#4A90B8]"
                      />
                      <span className="text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
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
