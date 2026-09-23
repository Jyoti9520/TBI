import React, { useState, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { tbiService } from '../services/tbiService';
import { SearchSuggestions } from './SearchSuggestions';

export const SearchBar = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search TBI, university, city or incubator type...',
  showFilterButton = false,
  onFilterToggle,
  filterActive = false
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Fetch suggestions when debounced value changes
  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      if (debouncedSearch && debouncedSearch.trim().length >= 2) {
        try {
          const res = await tbiService.getSuggestions(debouncedSearch.trim());
          if (active && res.success) {
            setSuggestions(res.data || []);
            setShowSuggestions(true);
          }
        } catch (_) {}
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  // Close suggestions when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const nextVal = e.target.value;
    setSearchTerm(nextVal);
    if (onChange) onChange(nextVal);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onChange) onChange('');
    if (onSearch) onSearch('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      if (onSearch) onSearch(searchTerm);
    }
  };

  const handleSelectSuggestion = (item) => {
    const query = item.query || item.title;
    setSearchTerm(query);
    if (onChange) onChange(query);
    if (onSearch) onSearch(query);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full flex items-center gap-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 bg-surface border border-slate-border rounded-xl text-sm text-slate placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all shadow-subtle"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-muted hover:text-slate transition-colors"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <SearchSuggestions
          suggestions={suggestions}
          onSelect={handleSelectSuggestion}
          visible={showSuggestions}
        />
      </div>

      {showFilterButton && (
        <button
          onClick={onFilterToggle}
          className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all shrink-0 ${
            filterActive
              ? 'bg-navy text-white border-navy shadow-sm'
              : 'bg-surface text-slate border-slate-border hover:bg-slate-50'
          }`}
          title="Filter Results"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      )}
    </div>
  );
};
