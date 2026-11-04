export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Wanderlust Private Limited. All rights reserved.</p>
        <div style={{ marginTop: '0.4rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Sitemap</a>
          <a href="#">Company details</a>
        </div>
      </div>
    </footer>
  );
}
