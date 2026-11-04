import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { listingApi } from '../api/client';
import BookingWidget from '../components/BookingWidget';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Wifi,
  Car,
  Tv,
  UtensilsCrossed,
  Wind,
  Shield,
  Trash2,
  Edit3,
  Loader2,
  ChevronLeft,
} from 'lucide-react';

export default function ListingDetail({ onOpenAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await listingApi.getById(id);
      if (res.data.success) {
        setListing(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Listing not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleDeleteListing = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await listingApi.delete(id);
      if (res.data.success) {
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete listing');
    }
  };

  const handleReviewAdded = (newReview) => {
    setListing((prev) => ({
      ...prev,
      reviews: [newReview, ...(prev.reviews || [])],
    }));
  };

  const handleReviewDeleted = (reviewId) => {
    setListing((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r._id !== reviewId),
    }));
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#717171' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Listing Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>{error}</p>
        <button className="submit-btn" style={{ maxWidth: '180px' }} onClick={() => navigate('/')}>
          Back to Listings
        </button>
      </div>
    );
  }

  const isOwner = !listing.owner || (user && listing.owner && (listing.owner._id === user._id || listing.owner === user._id));
  const imageUrl =
    listing.image?.url ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="container detail-page">
      <button
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#717171', marginBottom: '1.25rem', fontSize: '0.9rem' }}
      >
        <ChevronLeft size={18} /> Back to all listings
      </button>

      {/* Header */}
      <div className="detail-header">
        <h1>{listing.title}</h1>
        <div className="detail-subheader">
          <MapPin size={16} />
          <span>{listing.location}, {listing.country}</span>
        </div>
      </div>

      {/* Hero Gallery */}
      <div className="detail-gallery">
        <img src={imageUrl} alt={listing.title} />
      </div>

      {/* Layout Split: Details Left, Booking Widget Right */}
      <div className="detail-layout">
        <div>
          {/* Host info */}
          <div className="host-section">
            <div>
              <div className="host-title">
                Entire place hosted by @{listing.owner?.username || 'Wanderlust Host'}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                4 guests &bull; 2 bedrooms &bull; 2 beds &bull; 1 bath
              </p>
            </div>
            {isOwner && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  to={`/listings/${listing._id}/edit`}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#222', fontSize: '0.85rem', padding: '6px 14px', border: '1px solid #ccc', borderRadius: '8px', fontWeight: '600', transition: 'background 0.15s ease' }}
                >
                  <Edit3 size={15} /> Edit
                </Link>
                <button
                  onClick={handleDeleteListing}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e02f3a', fontSize: '0.85rem', padding: '6px 14px', border: '1px solid #e02f3a', borderRadius: '8px', fontWeight: '600' }}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="description-section">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>About this space</h3>
            <p style={{ whiteSpace: 'pre-line', color: '#333' }}>{listing.description}</p>
          </div>

          {/* Amenities */}
          <div style={{ padding: '2rem 0', borderBottom: '1px solid #ebebeb' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>What this place offers</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Wifi size={20} /> High-speed Wi-Fi</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Car size={20} /> Free parking on premises</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><UtensilsCrossed size={20} /> Kitchen & dining amenities</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Wind size={20} /> Air conditioning</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Tv size={20} /> 55" 4K Smart TV</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Shield size={20} /> Carbon monoxide detector</div>
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewSection
            listingId={listing._id}
            reviews={listing.reviews || []}
            onReviewAdded={handleReviewAdded}
            onReviewDeleted={handleReviewDeleted}
            onOpenAuth={onOpenAuth}
          />
        </div>

        {/* Sticky Booking Widget */}
        <div>
          <BookingWidget listing={listing} onOpenAuth={onOpenAuth} />
        </div>
      </div>
    </div>
  );
}
