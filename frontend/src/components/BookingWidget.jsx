import { useState } from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BookingWidget({ listing, onOpenAuth }) {
  const { user } = useAuth();

  // Default dates: tomorrow and 3 days later
  const today = new Date();
  const defaultCheckIn = new Date(today);
  defaultCheckIn.setDate(today.getDate() + 1);
  const defaultCheckOut = new Date(today);
  defaultCheckOut.setDate(today.getDate() + 4);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(formatDate(defaultCheckIn));
  const [checkOut, setCheckOut] = useState(formatDate(defaultCheckOut));
  const [guests, setGuests] = useState(1);
  const [isBooked, setIsBooked] = useState(false);

  // Calculate nights
  const dIn = new Date(checkIn);
  const dOut = new Date(checkOut);
  const timeDiff = dOut.getTime() - dIn.getTime();
  const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

  const basePrice = listing.price || 1500;
  const stayCost = basePrice * nights;
  const cleaningFee = Math.round(basePrice * 0.08);
  const gstFee = Math.round(stayCost * 0.18);
  const totalCost = stayCost + cleaningFee + gstFee;

  const handleReserve = () => {
    if (!user) {
      onOpenAuth('login');
      return;
    }
    setIsBooked(true);
  };

  return (
    <div className="booking-widget-card">
      <div className="booking-header">
        <div>
          <span className="booking-price">&#8377;{basePrice.toLocaleString('en-IN')}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}> / night</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: '600' }}>
          <Star size={14} fill="#222" />
          <span>
            {listing.reviews?.length > 0
              ? (
                  listing.reviews.reduce((acc, r) => acc + (r.rating || 5), 0) /
                  listing.reviews.length
                ).toFixed(1)
              : 'New'}
          </span>
          <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>
            ({listing.reviews?.length || 0} reviews)
          </span>
        </div>
      </div>

      <div className="booking-box">
        <div className="dates-row">
          <div className="date-input-group">
            <div className="input-label">Check-in</div>
            <input
              type="date"
              value={checkIn}
              min={formatDate(today)}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div className="date-input-group">
            <div className="input-label">Checkout</div>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div className="guests-group">
          <div className="input-label">Guests</div>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            <option value={1}>1 guest</option>
            <option value={2}>2 guests</option>
            <option value={3}>3 guests</option>
            <option value={4}>4 guests</option>
            <option value={5}>5+ guests</option>
          </select>
        </div>
      </div>

      <button className="reserve-btn" onClick={handleReserve}>
        {user ? 'Reserve Now' : 'Sign in to Reserve'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
        You won't be charged yet
      </p>

      {/* Dynamic Live Price Breakdown */}
      <div className="price-breakdown">
        <div className="breakdown-row">
          <span>&#8377;{basePrice.toLocaleString('en-IN')} &times; {nights} nights</span>
          <span>&#8377;{stayCost.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-row">
          <span>Cleaning fee</span>
          <span>&#8377;{cleaningFee.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-row">
          <span>Wanderlust service fee (18% GST)</span>
          <span>&#8377;{gstFee.toLocaleString('en-IN')}</span>
        </div>
        <div className="breakdown-row breakdown-total">
          <span>Total before taxes</span>
          <span>&#8377;{totalCost.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1.25rem', fontSize: '0.8rem', color: '#717171' }}>
        <ShieldCheck size={18} color="#008a05" />
        <span>Wanderlust Cover: Protected against cancellations & host issues.</span>
      </div>

      {/* Booking Confirmation Modal */}
      {isBooked && (
        <div className="modal-overlay" onClick={() => setIsBooked(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <button className="modal-close" onClick={() => setIsBooked(false)}>&times;</button>
            <CheckCircle2 size={54} color="#008a05" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Your reservation at <strong>{listing.title}</strong> is secured.
            </p>
            <div style={{ background: '#f7f7f7', borderRadius: '10px', padding: '1rem', textAlign: 'left', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              <div><strong>Dates:</strong> {checkIn} to {checkOut} ({nights} nights)</div>
              <div><strong>Guests:</strong> {guests} guest(s)</div>
              <div><strong>Total Paid:</strong> &#8377;{totalCost.toLocaleString('en-IN')}</div>
            </div>
            <button className="submit-btn" onClick={() => setIsBooked(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
