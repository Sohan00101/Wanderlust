import {
  Flame,
  BedDouble,
  Building2,
  Mountain,
  Castle,
  Waves,
  Tent,
  Wheat,
  Snowflake,
  Landmark,
  Palmtree,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  { label: 'All', icon: Sparkles },
  { label: 'Trending', icon: Flame },
  { label: 'Rooms', icon: BedDouble },
  { label: 'Iconic Cities', icon: Building2 },
  { label: 'Mountains', icon: Mountain },
  { label: 'Castles', icon: Castle },
  { label: 'Amazing Pools', icon: Waves },
  { label: 'Camping', icon: Tent },
  { label: 'Farms', icon: Wheat },
  { label: 'Arctic Place', icon: Snowflake },
  { label: 'Domes', icon: Landmark },
  { label: 'Beachfront', icon: Palmtree },
];

export default function CategoriesBar({ selectedCategory, onSelectCategory, showTaxes, onToggleTaxes }) {
  return (
    <div className="container">
      <div className="category-bar-wrapper">
        <div className="categories-scroll">
          {CATEGORIES.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`category-tab ${selectedCategory === label ? 'active' : ''}`}
              onClick={() => onSelectCategory(label)}
            >
              <Icon size={24} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Live Tax Toggle */}
        <div className="tax-toggle-box">
          <span>Display total before taxes</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={showTaxes}
              onChange={(e) => onToggleTaxes(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
