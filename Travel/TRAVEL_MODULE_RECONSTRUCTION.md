# Travel Module Reconstruction Guide

> **Purpose:** This document contains the complete travel module that was removed from the portfolio project. Use it to rebuild the travel experience as a standalone project or re-integrate it into any portfolio.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Data Layer](#2-data-layer)
3. [Map Component (Leaflet + OpenStreetMap)](#3-map-component)
4. [Main Travel Experience Component](#4-main-travel-experience-component)
5. [Travel Preview Component (Homepage)](#5-travel-preview-component)
6. [CSS Styles](#6-css-styles)
7. [API & Admin Integration](#7-api--admin-integration)
8. [Dependencies](#8-dependencies)
9. [Rebuild Instructions](#9-rebuild-instructions)

---

## 1. Architecture Overview

```
src/
├── blog/
│   ├── BlogExperience.jsx    # Main travel app with routing
│   ├── TravelMap.jsx         # Leaflet interactive map
│   ├── data.js               # All travel data (destinations, stats, etc.)
│   ├── blog.css              # All travel styles
│   ├── components/           # (reserved for sub-components)
│   └── pages/                # (reserved for sub-pages)
├── components/
│   └── TravelPreview.jsx     # Homepage preview section
├── styles/
│   ├── TravelPreview.css     # Homepage preview styles
│   └── TravelPage.css        # Additional travel page styles
├── services/
│   └── api.js                # Travel CRUD API functions
├── hooks/
│   └── useAdminData.js       # Travel data fetching hook
├── data/
│   └── dataStore.js          # Admin panel integration
├── components/admin/
│   ├── AdminContainer.jsx    # Admin tab for travels
│   └── editors/
│       └── TravelsEditor.jsx # Admin CRUD editor
├── pages/
│   └── HomePage.jsx          # TravelPreview section
└── App.jsx                   # Route: /travel/*
```

### Route Structure

| Route | Component | Description |
|-------|-----------|-------------|
| `/travel` | `TravelHub` | Overview with hero, stats, map, destinations grid, timeline, gallery |
| `/travel/map` | `MapPage` | Full-screen interactive map |
| `/travel/gallery` | `GalleryPage` | Searchable/filterable gallery |
| `/travel/blog` | `BlogPage` | Travel stories/articles |
| `/travel/timeline` | `TimelinePage` | Year-by-year timeline |
| `/travel/analytics` | `AnalyticsPage` | Stats, budget breakdown, memories |
| `/travel/bucket-list` | `BucketListPage` | Future destinations |
| `/travel/gear` | `GearPage` | Travel gear/equipment |
| `/travel/destination/:slug` | `DestinationDetail` | Full destination page |

---

## 2. Data Layer

### 2.1 Destinations Data (`src/blog/data.js`)

```javascript
export const destinations = [
  {
    slug: 'ujjain',
    name: 'Ujjain',
    state: 'Madhya Pradesh',
    year: '2024',
    category: 'Spiritual',
    rating: 4.9,
    coords: { x: 42, y: 46 },
    latLng: [23.1765, 75.7885],        // [latitude, longitude] for Leaflet
    labelOffset: { x: 3.2, y: -3.8 },
    summary: 'A sacred night of bells, queues, lamps, and the first unforgettable glimpse of Mahakal.',
    image: '/images/travel/ujjain-1.jpg',
    gallery: ['/images/travel/ujjain-1.jpg', '/images/travel/ujjain-2.jpg'],
    date: 'January 2024',
    budget: 'Rs. 6,500',
    distance: '780 km',
    duration: '3 days',
    altitude: '491 m',
    story: 'Ujjain felt less like a destination and more like a reset...',
    why: 'I visited Ujjain to experience Mahakaleshwar Jyotirlinga...',
    lessons: 'Some places do not impress loudly. They rearrange your attention.',
    food: ['Poha jalebi', 'Sabudana khichdi', 'Temple-side chai'],
    gems: ['Ram Ghat at sunrise', 'Kal Bhairav Temple', 'Old city lanes'],
    spots: ['Mahakal corridor', 'Shipra river steps', 'Night market lights'],
    tips: ['Book darshan slots early', 'Start before sunrise', 'Keep footwear storage money handy'],
    ratings: { Spiritual: 98, Food: 82, Adventure: 45, Photography: 88, Budget: 80 },
    mood: { Excitement: 86, Difficulty: 48, Spirituality: 98, Photography: 88, WorthIt: 96 },
    journal: [
      ['5:30 AM', 'Reached temple lanes while the city was still blue and quiet.'],
      ['6:15 AM', 'First glimpse of Mahakal corridor lights.'],
      ['7:00 AM', 'Joined the darshan queue with chants echoing ahead.'],
      ['8:40 AM', 'Entered the sanctum and felt the whole trip become still.'],
    ],
  },
  // ... more destinations follow the same schema
];
```

### 2.2 Complete Destination Schema

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | URL-friendly identifier |
| `name` | string | Destination name |
| `state` | string | Indian state |
| `year` | string | Year visited |
| `category` | string | Spiritual, Trek, Temple, City, Nature, Coastal |
| `rating` | number | 0-5 rating |
| `coords` | {x, y} | Map position (percentage-based) |
| `latLng` | [number, number] | [lat, lng] for Leaflet map markers |
| `labelOffset` | {x, y} | Map label offset |
| `summary` | string | Short description |
| `image` | string | Hero image path |
| `gallery` | string[] | Gallery image paths |
| `date` | string | Visit date |
| `budget` | string | Trip cost |
| `distance` | string | Travel distance |
| `duration` | string | Trip duration |
| `altitude` | string | Elevation |
| `story` | string | Full narrative |
| `why` | string | Reason for visiting |
| `lessons` | string | Personal takeaways |
| `food` | string[] | Food tried |
| `gems` | string[] | Hidden gems |
| `spots` | string[] | Photography spots |
| `tips` | string[] | Travel tips |
| `ratings` | object | Category ratings (0-100) |
| `mood` | object | Mood scores (0-100) |
| `journal` | [string, string][] | Timestamped journal entries |

### 2.3 All 10 Destinations

1. **Ujjain** (MP, 2024) - Spiritual - `[23.1765, 75.7885]`
2. **Omkareshwar** (MP, 2025) - Spiritual - `[22.2445, 76.1511]`
3. **Harihar Fort** (Maharashtra, 2025) - Trek - `[19.9065, 73.4787]`
4. **Trimbakeshwar** (Maharashtra, 2025) - Temple - `[19.9323, 73.5305]`
5. **Nashik** (Maharashtra, 2025) - City - `[19.9975, 73.7898]`
6. **Araku Valley** (AP, 2023) - Nature - `[18.3273, 82.8775]`
7. **Vizag** (AP, 2023) - Coastal - `[17.6868, 83.2185]`
8. **Hyderabad** (Telangana, 2024) - City - `[17.385, 78.4867]`
9. **Bhimashankar** (Maharashtra, 2025) - Temple - `[19.071, 73.5355]`
10. **Grishneshwar** (Maharashtra, 2025) - Temple - `[20.0248, 75.1699]`

### 2.4 Supporting Data

```javascript
// Stats strip
export const stats = [
  ['18', 'Journeys'],
  ['126', 'Days Exploring'],
  ['8', 'Sacred Destinations'],
  ['1', 'Life-Changing Trek'],
  ['1000s', 'Memories'],
];

// Budget breakdown
export const budgetData = [
  ['Transport', 36],
  ['Accommodation', 22],
  ['Food', 18],
  ['Darshan/Entry', 8],
  ['Shopping', 7],
  ['Others', 9],
];

// Bucket list
export const bucketList = [
  ['Kedarnath', 'Spiritual'],
  ['Badrinath', 'Spiritual'],
  ['Rameshwaram', 'Spiritual'],
  ['Kashi', 'Spiritual'],
  ['Leh Ladakh', 'Road Trip'],
  ['Spiti Valley', 'Nature'],
];

// Memories
export const memories = [
  ['Most Spiritual Experience', 'Mahakaleshwar darshan before sunrise'],
  ['Best Sunrise', 'RK Beach glowing over the Bay of Bengal'],
  ['Toughest Trek', 'Harihar Fort staircase in monsoon wind'],
  ['Best Food', 'Hyderabad biryani after a full city walk'],
  ['Most Beautiful View', 'Araku Valley under moving clouds'],
];

// Reels
export const reels = [
  ['Temple Reels', 'Mahakal corridors, ghats, lamps, and temple roads'],
  ['Trek Reels', 'Harihar steps, summit wind, and descent focus'],
  ['Nature Reels', 'Araku clouds, waterfalls, coffee roads'],
  ['Road Trip Reels', 'Nashik highways, rain glass, night halts'],
];

// Gallery items (auto-generated from destinations)
export const galleryItems = destinations.flatMap((destination, index) => [
  { id: `${destination.slug}-hero`, category: destination.category, title: `${destination.name} frame`, image: destination.image, tall: index % 3 === 0 },
  { id: `${destination.slug}-detail`, category: index % 2 === 0 ? 'Photography' : 'Food', title: `${destination.name} memory`, image: destination.image, tall: index % 4 === 0 },
]);

// Blog posts
export const posts = [
  { slug: 'my-journey-to-mahakaleshwar', title: 'My Journey To Mahakaleshwar', category: 'Spiritual', tags: ['Ujjain', 'Jyotirlinga', 'Temple'], minutes: 8, excerpt: '...', image: destinations[0].image },
  { slug: 'how-i-climbed-harihar-fort', title: 'How I Climbed Harihar Fort', category: 'Trekking', tags: ['Harihar Fort', 'Monsoon', 'Trek'], minutes: 7, excerpt: '...', image: destinations[2].image },
  { slug: 'araku-during-monsoon', title: 'Araku During Monsoon', category: 'Nature', tags: ['Araku', 'Coffee', 'Valley'], minutes: 6, excerpt: '...', image: destinations[5].image },
  { slug: 'omkareshwar-budget-guide', title: 'Omkareshwar Budget Guide', category: 'Budget', tags: ['Omkareshwar', 'Narmada', 'Guide'], minutes: 5, excerpt: '...', image: destinations[1].image },
];

// Gear
export const gear = [
  ['Camera', 'For wide landscapes, temples, and low-light travel frames.', 'Sample output: sunrise, ghats, fort trails.'],
  ['Smartphone', 'Fast reels, GPS, notes, and spontaneous street photography.', 'Sample output: vertical travel stories.'],
  ['Tripod', 'Stable night shots, self portraits, and long-exposure frames.', 'Sample output: temple lights and traffic trails.'],
  ['Backpack', 'Compact travel setup for clothes, tech, water, and rain cover.', 'Sample output: flexible one-bag weekends.'],
  ['Editing Software', 'Color grading and cinematic story sequencing.', 'Sample output: documentary-style reels.'],
];

export const achievements = [
  'First Solo Trip', 'First Trek', 'First Jyotirlinga',
  '5000 KM Milestone', '10th Destination', '100 Travel Days',
];
```

---

## 3. Map Component

### 3.1 Technology

- **Library:** `react-leaflet` + `leaflet`
- **Tile Provider:** OpenStreetMap (free, no API key required)
- **Features:** Custom animated markers, fitted bounds, zoom controls, popups with images/dates/links

### 3.2 Component Code (`src/blog/TravelMap.jsx`)

```jsx
import React, { memo, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { divIcon, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

function FitVisitedBounds({ destinations }) {
  const map = useMap();

  useEffect(() => {
    const points = destinations.map((destination) => destination.latLng);
    if (points.length > 0) {
      map.fitBounds(latLngBounds(points), {
        animate: true,
        duration: 1,
        padding: [42, 42],
        maxZoom: 8,
      });
    }
  }, [destinations, map]);

  return null;
}

function TravelMap({ destinations, featuredSlug }) {
  const mapCenter = useMemo(() => [20.5937, 78.9629], []); // India center
  const markerIcon = useMemo(
    () =>
      divIcon({
        className: 'travel-pin-icon',
        iconAnchor: [18, 38],
        popupAnchor: [0, -34],
        html: '<span class="travel-pin"><span></span></span>',
      }),
    []
  );

  return (
    <div className="leaflet-showcase" aria-label="Interactive map of visited destinations">
      <MapContainer
        center={mapCenter}
        zoom={5}
        minZoom={4}
        maxZoom={14}
        scrollWheelZoom
        zoomControl={false}
        className="travel-leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        <FitVisitedBounds destinations={destinations} />
        {destinations.map((destination, index) => (
          <Marker
            key={destination.slug}
            position={destination.latLng}
            icon={markerIcon}
            riseOnHover
            zIndexOffset={destination.slug === featuredSlug ? 500 : index}
          >
            <Popup className="travel-popup" minWidth={230}>
              <article>
                {destination.image && <img src={destination.image} alt="" loading="lazy" />}
                <span>{destination.date || destination.year}</span>
                <h3>{destination.name}</h3>
                <p>{destination.summary}</p>
                <Link to={`/travel/destination/${destination.slug}`}>View story</Link>
              </article>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default memo(TravelMap);
```

### 3.3 Map CSS (in blog.css)

```css
.leaflet-showcase,
.travel-leaflet-map {
  min-height: 620px;
  border-radius: 16px;
  overflow: hidden;
}

.travel-leaflet-map {
  z-index: 0;
}

.travel-leaflet-map .leaflet-control-zoom a {
  border: 0;
  background: rgba(8, 11, 16, 0.88);
  color: #e2e8f0;
}

.travel-leaflet-map .leaflet-control-zoom a:hover {
  background: #0f766e;
}

.travel-leaflet-map .leaflet-control-attribution {
  background: rgba(8, 11, 16, 0.72);
  color: rgba(255, 255, 255, 0.5);
}

.travel-leaflet-map .leaflet-control-attribution a {
  color: #5eead4;
}

/* Custom marker pins */
.travel-pin-icon {
  background: transparent;
  border: 0;
}

.travel-pin {
  position: relative;
  display: block;
  width: 36px;
  height: 36px;
}

.travel-pin::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #5eead4, #0d9488);
  box-shadow: 0 0 0 3px rgba(94, 234, 212, 0.3), 0 4px 12px rgba(0, 0, 0, 0.4);
  animation: pinPulse 2.4s ease-in-out infinite;
}

.travel-pin span {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #5eead4, #0d9488);
}

@keyframes pinPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(94, 234, 212, 0.3), 0 4px 12px rgba(0, 0, 0, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(94, 234, 212, 0.12), 0 4px 12px rgba(0, 0, 0, 0.4); }
}

/* Popup styling */
.travel-popup .leaflet-popup-content-wrapper {
  overflow: hidden;
  border-radius: 12px;
  background: rgba(8, 11, 16, 0.96);
  backdrop-filter: blur(12px);
  color: #e2e8f0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}

.travel-popup .leaflet-popup-content {
  width: 245px !important;
  margin: 0;
}

.travel-popup .leaflet-popup-tip {
  background: rgba(8, 11, 16, 0.96);
}

.travel-popup article {
  display: grid;
  gap: 8px;
  padding: 0;
}

.travel-popup img {
  width: 100%;
  height: 130px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

.travel-popup span {
  color: #5eead4;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 12px;
}

.travel-popup h3 {
  margin: 0;
  font-size: 1rem;
  padding: 0 12px;
}

.travel-popup p {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  padding: 0 12px;
}

.travel-popup a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  margin: 8px 12px 12px;
  padding: 0 16px;
  border: 1px solid rgba(94, 234, 212, 0.52);
  border-radius: 8px;
  color: #5eead4;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s;
}

.travel-popup a:hover {
  background: rgba(94, 234, 212, 0.1);
  transform: translateY(-2px);
}
```

---

## 4. Main Travel Experience Component

### 4.1 Component (`src/blog/BlogExperience.jsx`)

This is the main travel application with 527 lines. Key sections:

**Navigation Items:**
```jsx
const navItems = [
  ['Overview', '/travel'],
  ['Map', '/travel/map'],
  ['Gallery', '/travel/gallery'],
  ['Stories', '/travel/blog'],
  ['Timeline', '/travel/timeline'],
  ['Analytics', '/travel/analytics'],
  ['Bucket', '/travel/bucket-list'],
  ['Gear', '/travel/gear'],
];
```

**Categories for filtering:**
```jsx
const categories = ['All', 'Spiritual', 'Nature', 'Trek', 'Temple', 'City', 'Coastal', 'Food', 'Photography'];
```

**Main Component Structure:**
```jsx
function BlogExperience() {
  return (
    <main className="travel-shell">
      <TravelNav />
      <Routes>
        <Route index element={<TravelHub />} />
        <Route path="destination/:slug" element={<DestinationDetail />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="reels" element={<ReelsPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="bucket-list" element={<BucketListPage />} />
        <Route path="gear" element={<GearPage />} />
      </Routes>
    </main>
  );
}
```

### 4.2 Sub-Components

| Component | Description |
|-----------|-------------|
| `TravelNav` | Fixed sidebar navigation with hover expansion |
| `TravelHub` | Landing page with hero, stats, map, destinations grid, featured journey, timeline, gallery preview |
| `StatsStrip` | Animated stats counter row |
| `SectionHeader` | Reusable section header with kicker, title, text |
| `MapShowcase` | Map + featured destination dossier side-by-side |
| `DestinationGrid` | Grid of all destination cards |
| `DestinationCard` | Individual destination card with image, category, name, summary |
| `FeaturedJourney` | Hero destination with full story |
| `TimelineSection` | Year-grouped timeline of all destinations |
| `GalleryPreview` | Masonry gallery grid |
| `GalleryMasonry` | Reusable masonry grid component |
| `DestinationDetail` | Full destination page with hero, overview, journal, food, gems, spots, tips, ratings, gallery, related |
| `DetailBlock` | Text section block |
| `ListBlock` | Chip/tag list block |
| `Journal` | Timestamped journal entries |
| `MoodBars` | Horizontal bar chart for ratings |
| `GalleryPage` | Full gallery with search and category filter |
| `FilterBar` | Search input + category filter buttons |
| `ReelsPage` | Vertical travel moments cards |
| `MapPage` | Full-screen map showcase |
| `AnalyticsPage` | Stats, budget bars, memories |
| `BudgetBars` | Horizontal budget breakdown bars |
| `BlogPage` | Searchable travel articles |
| `TimelinePage` | Dedicated full timeline |
| `BucketListPage` | Category-grouped bucket list |
| `GearPage` | Travel gear grid |

### 4.3 Full Component Code

The complete `BlogExperience.jsx` (527 lines) is available in the original project at `parallax-portfolio/src/blog/BlogExperience.jsx`. Key patterns:

- All components use `reveal` class for scroll-triggered animations
- Navigation uses `NavLink` with `isActive` for active state
- Destinations are linked via `/travel/destination/:slug`
- All data comes from `./data.js` imports
- Map uses `TravelMap` component with `destinations` and `featuredSlug` props

---

## 5. Travel Preview Component

### 5.1 Component (`src/components/TravelPreview.jsx`)

A 150-line homepage preview section showing 6 featured destinations with:
- Intersection Observer for scroll-triggered visibility
- Category-based color coding
- Image with location badge, state, category
- Summary, highlights, memory, and "View Journey" button
- "Explore All Destinations" footer CTA

### 5.2 CSS (`src/styles/TravelPreview.css`)

Full CSS with:
- Dark theme with gradient backgrounds
- Grid layout (3 columns desktop, 2 tablet, 1 mobile)
- Card hover effects with glow and transform
- Location badge, category tag, country tag positioning
- Scroll-triggered visibility animations
- Responsive breakpoints at 1024px and 768px

---

## 6. CSS Styles

### 6.1 Main Travel Styles (`src/blog/blog.css`)

Key style sections:

| Section | Lines | Description |
|---------|-------|-------------|
| `.travel-shell` | Base | Full-height container with dark theme |
| `.travel-nav` | Fixed | Collapsible sidebar nav (280px expanded, 60px collapsed) |
| `.travel-brand` | Brand | Logo with hover-reveal text |
| `.travel-nav-scroll` | Nav items | Vertical nav with initial-letter indicators |
| `.travel-hero` | Hero | Full-viewport hero with parallax background |
| `.stats-strip` | Stats | Horizontal stats counter row |
| `.travel-section` | Sections | Max-width 1160px centered content sections |
| `.map-layout` | Map | Flex layout: map (1fr) + dossier (320px) |
| `.destination-grid` | Grid | 3-column responsive grid |
| `.destination-card` | Cards | Image + content cards with hover effects |
| `.featured-journey` | Featured | Side-by-side image + text layout |
| `.timeline` | Timeline | Year-grouped vertical timeline |
| `.masonry` | Gallery | CSS masonry grid |
| `.detail-hero` | Detail | Destination detail hero with background image |
| `.detail-layout` | Detail | Article (1fr) + sticky sidebar (280px) |
| `.detail-block` | Detail | Content sections |
| `.journal-list` | Journal | Timestamped entry list |
| `.mood-bars` | Ratings | Horizontal bar chart |
| `.filter-bar` | Gallery | Search + category filter |
| `.reel-row` | Reels | Horizontal scrollable reel cards |
| `.quick-grid` | Analytics | Stats grid |
| `.bar-chart` | Budget | Horizontal budget bars |
| `.post-grid` | Blog | Article grid |
| `.bucket-columns` | Bucket | Category-grouped columns |
| `.gear-grid` | Gear | Equipment grid |

### 6.2 Travel Page CSS (`src/styles/TravelPage.css`)

Additional travel page styles (placeholder/backup styles).

---

## 7. API & Admin Integration

### 7.1 API Functions (`src/services/api.js`)

```javascript
// Travel API
export const getTravels = async () => normalizeListResponse(await apiCall('/travel'));
export const getTravelBySlug = async (slug) => apiCall(`/travel/${slug}`);
export const createTravel = (formData) =>
  apiCall('/travel', { method: 'POST', body: formData });
export const updateTravel = (id, formData) =>
  apiCall(`/travel/${id}`, { method: 'PUT', body: formData });
export const deleteTravel = (id) =>
  apiCall(`/travel/${id}`, { method: 'DELETE' });
```

### 7.2 Admin Data Hook (`src/hooks/useAdminData.js`)

```javascript
// Initial state includes:
const initialState = {
  // ... other fields
  travels: []
};

// Data fetching includes:
const [bio, projects, certs, internships, skills, contacts, travels] = await Promise.all([
  // ... other API calls
  api.getTravels()
]);
```

### 7.3 Admin Container Tab (`src/components/admin/AdminContainer.jsx`)

```jsx
const adminTabs = [
  // ... other tabs
  { id: 'travels', label: 'TRAVEL DIARIES', icon: 'fa-globe-asia' }
];

// Tab rendering:
case 'travels':
  return <TravelsEditor travels={travels} onUpdate={handleUpdate} loading={loading} />;
```

### 7.4 Travels Editor (`src/components/admin/editors/TravelsEditor.jsx`)

Full CRUD editor with fields for:
- slug, name, state, year, category, rating, image URL
- date, budget, distance, duration, altitude
- summary, story, why, lessons
- food, gems, spots, tips (comma-separated arrays)
- ratings (Spiritual, Food, Adventure, Photography, Budget)
- mood (Excitement, Difficulty, Spirituality, Photography, WorthIt)
- Journal entries (dynamic add/remove)
- Featured destination toggle
- Save All, Delete, Add New functionality

---

## 8. Dependencies

### 8.1 Required npm Packages

```json
{
  "react-leaflet": "^4.2.1",
  "leaflet": "^1.9.4"
}
```

### 8.2 CSS Imports

```css
/* In index.css or main CSS file */
@import 'leaflet/dist/leaflet.css';
@import './styles/TravelPreview.css';
@import './styles/TravelPage.css';
/* Or import blog.css directly */
```

### 8.3 Route Setup (in App.jsx)

```jsx
import BlogExperience from './blog/BlogExperience';

// In Routes:
<Route path="/travel/*" element={<BlogExperience />} />
```

### 8.4 Homepage Integration (in HomePage.jsx)

```jsx
import TravelPreview from '../components/TravelPreview';

// In JSX:
<TravelPreview onExploreClick={handleActionClick} />
```

---

## 9. Rebuild Instructions

### Option A: Standalone Travel App

1. Create a new Vite + React project
2. Copy the `src/blog/` directory into your project
3. Install dependencies: `npm install react-leaflet leaflet react-router-dom`
4. Import `BlogExperience` and set up routing for `/travel/*`
5. Copy `src/blog/blog.css` and import it
6. Add images to `public/images/travel/` directory
7. Run `npm run dev`

### Option B: Re-integrate into Portfolio

1. Copy `src/blog/` directory back to project
2. Copy `src/components/TravelPreview.jsx` back
3. Copy `src/styles/TravelPreview.css` and `src/styles/TravelPage.css` back
4. Add CSS imports to `src/index.css`:
   ```css
   @import './styles/TravelPreview.css';
   @import './styles/TravelPage.css';
   ```
5. Add route in `src/App.jsx`:
   ```jsx
   import BlogExperience from './blog/BlogExperience';
   // In Routes:
   <Route path="/travel/*" element={<BlogExperience />} />
   ```
6. Add TravelPreview to `src/pages/HomePage.jsx`
7. Install: `npm install react-leaflet leaflet`
8. Add API functions to `src/services/api.js`
9. Add admin editor tab to `src/components/admin/AdminContainer.jsx`
10. Copy `src/components/admin/editors/TravelsEditor.jsx` back

### Option C: Use as Static Site

1. Extract all data from `src/blog/data.js` as JSON
2. Use the Leaflet map component standalone with the `latLng` coordinates
3. Build static HTML pages using the destination data
4. Use OpenStreetMap tiles (free, no API key)

---

## Image Assets Required

Place images in `public/images/travel/`:

| Image | Description |
|-------|-------------|
| `ujjain-1.jpg`, `ujjain-2.jpg` | Ujjain temple, ghats |
| `omkareshwar-1.jpg`, `omkareshwar-2.jpg` | Omkareshwar island, Narmada |
| `harihar-fort-1.jpg`, `harihar-fort-2.jpg` | Harihar Fort staircase, summit |
| `trimbakeshwar-1.jpg`, `trimbakeshwar-2.jpg` | Trimbakeshwar temple, hills |
| `nashik-1.jpg`, `nashik-2.jpg` | Nashik ghats, city |
| `araku-valley-1.jpg`, `araku-valley-2.jpg` | Araku Valley, coffee plantations |
| `vizag-1.jpg`, `vizag-2.jpg` | Vizag beach, coastline |
| `hyderabad-1.jpg`, `hyderabad-2.jpg` | Hyderabad Charminar, city |
| `bhimashankar-1.jpg`, `bhimashankar-2.jpg` | Bhimashankar forest, temple |
| `grishneshwar-1.jpg`, `grishneshwar-2.jpg` | Grishneshwar temple, Ellora |

---

## Key Features Summary

- ✅ **Interactive Map** with Leaflet + OpenStreetMap (free, no API key)
- ✅ **10 Destinations** with full data (coordinates, stories, ratings, journals)
- ✅ **Custom Map Markers** with animated pulse effect
- ✅ **Popup Cards** with images, dates, summaries, and links
- ✅ **Auto-Fit Bounds** to show all markers optimally
- ✅ **Gallery** with search and category filtering
- ✅ **Timeline** grouped by year
- ✅ **Analytics** with stats, budget breakdown, memories
- ✅ **Bucket List** for future destinations
- ✅ **Gear/Equipment** showcase
- ✅ **Travel Stories/Blog** with search
- ✅ **Destination Detail Pages** with full narrative, journal, ratings, tips
- ✅ **Homepage Preview** with 6 featured destinations
- ✅ **Admin CRUD** for managing destinations
- ✅ **Responsive Design** (desktop, tablet, mobile)
- ✅ **Dark Theme** with teal accent color
- ✅ **Scroll Animations** via Intersection Observer
- ✅ **Category System**: Spiritual, Trek, Temple, City, Nature, Coastal