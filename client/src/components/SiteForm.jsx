import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createSite, updateSite } from '../features/sites/siteSlice';

function SiteForm({ site, onClose, mode = 'create' }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && site) {
      setFormData({
        name: site.name || '',
        location: site.location || '',
        description: site.description || '',
      });
    }
  }, [site, mode]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Site name must be at least 2 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Site name must not exceed 100 characters';
    }

    if (!formData.location || formData.location.length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    } else if (formData.location.length > 200) {
      newErrors.location = 'Location must not exceed 200 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'create') {
        await dispatch(createSite(formData)).unwrap();
        toast.success('Site created successfully!');
      } else {
        await dispatch(updateSite({ id: site._id, siteData: formData })).unwrap();
        toast.success('Site updated successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to save site');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">
            {mode === 'create' ? 'Add New Site' : 'Edit Site'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="FeroCrafts - Plant A"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ahmedabad, Gujarat"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full border rounded-md px-3 py-2 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Site description (optional)"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create Site' : 'Update Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SiteForm;




