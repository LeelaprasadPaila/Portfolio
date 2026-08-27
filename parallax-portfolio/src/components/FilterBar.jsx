import React, { useState, useMemo } from 'react';

const FilterBar = ({ 
  items = [], 
  categories = [], 
  onFilterChange, 
  searchPlaceholder = 'Search...',
  showSearch = true,
  showCategories = true
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    onFilterChange({ category, search: searchQuery });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onFilterChange({ category: activeCategory, search: query });
  };

  const categoryCounts = useMemo(() => {
    const counts = { All: items.length };
    categories.forEach(cat => {
      if (cat !== 'All') {
        counts[cat] = items.filter(item => 
          item.category === cat || item.type === cat
        ).length;
      }
    });
    return counts;
  }, [items, categories]);

  return (
    <div className="filter-bar">
      {showSearch && (
        <div className="filter-search">
          <svg className="filter-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="filter-search-input"
          />
          {searchQuery && (
            <button className="filter-search-clear" onClick={() => {
              setSearchQuery('');
              onFilterChange({ category: activeCategory, search: '' });
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      )}

      {showCategories && (
        <div className="filter-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
              <span className="filter-count">{categoryCounts[category] || 0}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;