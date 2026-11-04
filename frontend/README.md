# Wanderlust Frontend (React + Vite)

Modern React SPA frontend for the Wanderlust Airbnb Clone.

## Features
- **Instant Search & Category Filtering**: Live debounced search and category pills (Trending, Rooms, Iconic Cities, Mountains, etc.) without page reloads.
- **Dynamic Tax Toggle**: Instant "Display total before taxes" switch that live-updates cards.
- **Interactive Booking & Price Calculator**:
  - Check-in & checkout date selection.
  - Guest counter.
  - Live cost breakdown (Nights &times; Rate + Cleaning Fee + 18% GST).
  - Instant Reservation confirmation modal.
- **Interactive Star Reviews**: Live star rating selector and instant review submission without page refresh.
- **Wishlist Toggle**: Heart button on every listing card with smooth animations.
- **Authentication**: Seamless Login & Signup modal with session management.

## Running in Development
```bash
# In the frontend directory:
npm run dev

# Or from the project root:
npm run frontend
```
Runs at `http://localhost:5173`, with API requests automatically proxied to Express at `http://localhost:8080`.
