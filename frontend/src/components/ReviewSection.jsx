import { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { reviewApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ReviewSection({ listingId, reviews, onReviewAdded, onReviewDeleted, onOpenAuth }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth('login');
      return;
    }
    if (!comment.trim()) {
      setError('Please enter a review comment');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await reviewApi.add(listingId, { rating, comment });
      if (res.data.success) {
        setComment('');
        setRating(5);
        if (onReviewAdded) onReviewAdded(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await reviewApi.delete(listingId, reviewId);
      if (res.data.success && onReviewDeleted) {
        onReviewDeleted(reviewId);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete review');
    }
  };

  return (
    <div className="reviews-section">
      <h2 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Star size={20} fill="#222" />
        <span>Reviews ({reviews?.length || 0})</span>
      </h2>

      {/* Review Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '14px', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>Leave a Review</h3>
        
        {error && <div style={{ color: '#e02f3a', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{error}</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1rem' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                size={24}
                fill={(hoverRating || rating) >= star ? '#fe424d' : 'transparent'}
                stroke={(hoverRating || rating) >= star ? '#fe424d' : '#999'}
              />
            </button>
          ))}
          <span style={{ marginLeft: '8px', fontSize: '0.9rem', color: '#555' }}>
            {hoverRating || rating} out of 5 stars
          </span>
        </div>

        <div className="form-group">
          <label>Comments</label>
          <textarea
            rows={3}
            placeholder="Share your experience staying here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          style={{ maxWidth: '180px' }}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {/* Reviews List */}
      <div className="reviews-grid">
        {reviews && reviews.length > 0 ? (
          reviews.map((rev) => {
            const isAuthor = user && rev.author && (rev.author._id === user._id || rev.author === user._id);
            return (
              <div key={rev._id} className="review-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="review-author">
                    @{rev.author?.username || 'Guest Traveler'}
                  </div>
                  {isAuthor && (
                    <button
                      onClick={() => handleDelete(rev._id)}
                      style={{ color: '#999', transition: 'color 0.2s' }}
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '2px', margin: '0.2rem 0' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= (rev.rating || 5) ? '#fe424d' : 'transparent'}
                      stroke={s <= (rev.rating || 5) ? '#fe424d' : '#ccc'}
                    />
                  ))}
                </div>

                <p className="review-comment">{rev.comment}</p>
              </div>
            );
          })
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to leave a review!</p>
        )}
      </div>
    </div>
  );
}
