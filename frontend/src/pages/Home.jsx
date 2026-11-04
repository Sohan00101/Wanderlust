import { useState, useEffect } from 'react';
import CategoriesBar from '../components/CategoriesBar';
import ListingCard from '../components/ListingCard';
import { listingApi } from '../api/client';
import { SearchX, Loader2 } from 'lucide-react';

export default function Home({ searchTerm }) {
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showTaxes, setShowTaxes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const res = await listingApi.getAll(params);
      if (res.data.success) {
        setListings(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 250); // slight debounce for live search

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  return (
    <div>
      <CategoriesBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        showTaxes={showTaxes}
        onToggleTaxes={setShowTaxes}
      />

      <div className="container">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', gap: '1rem', color: '#717171' }}>
            <Loader2 size={36} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
            <p>Finding wonderful stays...</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#e02f3a' }}>
            <p>{error}</p>
            <button className="submit-btn" style={{ maxWidth: '160px', marginTop: '1rem' }} onClick={fetchListings}>
              Try Again
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#717171' }}>
            <SearchX size={52} strokeWidth={1.5} style={{ margin: '0 auto 1rem', color: '#b0b0b0' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#222', marginBottom: '0.4rem' }}>No listings found</h3>
            <p style={{ fontSize: '0.9rem' }}>Try adjusting your search or category filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((item) => (
              <ListingCard key={item._id} listing={item} showTaxes={showTaxes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
