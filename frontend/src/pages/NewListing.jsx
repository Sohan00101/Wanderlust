import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Home, Sparkles, ChevronLeft } from 'lucide-react';

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

export default function NewListing({ onOpenAuth }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Trending',
    price: '',
    location: '',
    country: '',
    image: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      setLoading(true);
      setError('');
      const payload = {
        ...formData,
        price: Number(formData.price),
      };
      const res = await listingApi.create(payload);
      if (res.data.success) {
        navigate(`/listings/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '720px', padding: '2rem 1.5rem 4rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#717171', marginBottom: '1.5rem', fontSize: '0.9rem' }}
      >
        <ChevronLeft size={18} /> Cancel & go back
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
        <Home size={28} color="var(--primary)" />
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Create a New Listing</h1>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Share your home with travelers around the world.
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
            placeholder="e.g. Luxury Beachfront Villa with Infinity Pool"
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
            placeholder="Describe what makes your space special, nearby attractions, amenities..."
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
              placeholder="e.g. 2500"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="image"
            placeholder="https://images.unsplash.com/photo-..."
            value={formData.image}
            onChange={handleChange}
          />
          <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Paste a high-resolution image link from Unsplash or Cloudinary.
          </small>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Location / City</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Candolim, Goa"
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
              placeholder="e.g. India"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          style={{ padding: '0.95rem', fontSize: '1rem', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? 'Publishing Listing...' : 'Publish Listing'}
        </button>
      </form>
    </div>
  );
}
