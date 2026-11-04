import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';

export default function ListingCard({ listing, showTaxes }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const basePrice = listing.price || 0;
  const displayPrice = showTaxes ? Math.round(basePrice * 1.18) : basePrice;

  // Calculate average rating if reviews exist
  const avgRating =
    listing.reviews && listing.reviews.length > 0
      ? (
          listing.reviews.reduce((acc, rev) => acc + (rev.rating || 5), 0) /
          listing.reviews.length
        ).toFixed(1)
      : 'New';

  const imageUrl =
    listing.image?.url ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';

  return (
    <Link to={`/listings/${listing._id}`} className="listing-card">
      <div className="card-img-wrapper">
        <img src={imageUrl} alt={listing.title} loading="lazy" />
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={toggleWishlist}
          aria-label="Save to wishlist"
        >
          <Heart
            size={22}
            fill={isWishlisted ? '#fe424d' : 'rgba(0, 0, 0, 0.4)'}
            stroke={isWishlisted ? '#fe424d' : '#ffffff'}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="card-info">
        <div className="card-title-row">
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
            {listing.title}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.9rem' }}>
            <Star size={14} fill="#222" />
            {avgRating}
          </span>
        </div>

        <div className="card-location">
          {listing.location}, {listing.country}
        </div>

        <div className="card-price-row">
          <span className="card-price">
            &#8377;{displayPrice.toLocaleString('en-IN')}
          </span>
          <span style={{ color: 'var(--text-muted)' }}> / night</span>
          {showTaxes && <span className="tax-badge">(incl. 18% GST)</span>}
        </div>
      </div>
    </Link>
  );
}
