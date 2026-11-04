import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Edit3, ChevronLeft, Loader2, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = [
  'Trending',
  'Rooms',
  'Iconic Cities',
  'Mountains',
  'Castles',
  'Amazing Pools',
  'Camping',
  'Farms',
  'Arctic Place',
  'Domes',
  'Beachfront',
];

export default function EditListing({ onOpenAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Trending',
    price: '',
    location: '',
    country: '',
    image: '',
  });

  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await listingApi.getById(id);
        if (res.data.success) {
          const l = res.data.data;
          setFormData({
            title: l.title || '',
            description: l.description || '',
            category: l.category || 'Trending',
            price: l.price || '',
            location: l.location || '',
            country: l.country || '',
            image: l.image?.url || '',
          });
          setCurrentImageUrl(l.image?.url || '');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch listing details');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth('login');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const payload = {
        ...formData,
        price: Number(formData.price),
      };
      const res = await listingApi.update(id, payload);
      if (res.data.success) {
        navigate(`/listings/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#717171' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '720px', padding: '2rem 1.5rem 4rem' }}>
      <button
        onClick={() => navigate(`/listings/${id}`)}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#717171', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ChevronLeft size={18} /> Cancel & return to listing
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
        <Edit3 size={28} color="var(--primary)" />
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Edit Listing</h1>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Update details, price, description, and images for your property.
      </p>

      {error && (
        <div style={{ background: '#ffe6e6', color: '#d00', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Listing Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={4}
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Price per Night (&#8377; INR)</label>
            <input
              type="number"
              name="price"
              required
              min="100"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Current Image Preview & URL input */}
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Paste image link..."
          />
          {formData.image && (
            <div style={{ marginTop: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Image Preview:
              </span>
              <img
                src={formData.image}
                alt="Listing preview"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #ebebeb' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Location / City</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            type="submit"
            className="submit-btn"
            style={{ flex: 1, padding: '0.95rem', fontSize: '1rem' }}
            disabled={saving}
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/listings/${id}`)}
            style={{ padding: '0.95rem 1.5rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem', color: '#555' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
