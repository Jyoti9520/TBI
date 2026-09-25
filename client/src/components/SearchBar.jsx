import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { tbiService } from '../services/tbiService';
import { SearchSuggestions } from './SearchSuggestions';

export const SearchBar = ({
  value = '',
  onChange,
  onSearch,
  onSelect,
  placeholder = 'Search TBI, university, city or incubator type...',
  showFilterButton = false,
  onFilterToggle,
  filterActive = false
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debouncedSearch = useDebounce(searchTerm, 250);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Fetch suggestions from real API data based on user input
  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      const trimmed = debouncedSearch ? debouncedSearch.trim() : '';
      if (trimmed.length >= 1) {
        setLoadingSuggestions(true);
        try {
          const res = await tbiService.getSuggestions(trimmed);
          if (active && res.success) {
            setSuggestions(res.data || []);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }
        } catch (_) {
          if (active) setSuggestions([]);
        } finally {
          if (active) setLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  // Handle clicking outside to dismiss suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
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
    setSelectedIndex(-1);
  };

  // Keyboard navigation: Arrow Up/Down, Enter, Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
      setSelectedIndex(-1);
      return;
    }

    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        return;
      }

      if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[selectedIndex]);
          return;
        }
      }
    }

    if (e.key === 'Enter') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      if (onSearch) onSearch(searchTerm);
    }
  };

  const handleSelectSuggestion = (item) => {
    setShowSuggestions(false);
    setSelectedIndex(-1);

    if (onSelect) {
      onSelect(item);
      return;
    }

    // Default selection behavior: Navigate directly to TBI details
    if (item?.id) {
      navigate(`/tbi/${item.id}`);
    } else {
      const query = item?.university || item?.name || searchTerm;
      setSearchTerm(query);
      if (onChange) onChange(query);
      if (onSearch) onSearch(query);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full flex items-center gap-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B0712]">
          {loadingSuggestions ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#5B0712]" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchTerm.trim().length >= 1) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          className="w-full pl-10 pr-9 py-2.5 bg-surface border border-slate-border rounded-xl text-sm text-slate placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-[#5B0712]/30 focus:border-[#5B0712] transition-all shadow-subtle"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-muted hover:text-slate transition-colors"
            title="Clear search"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Suggestion Dropdown */}
        <SearchSuggestions
          suggestions={suggestions}
          query={searchTerm}
          selectedIndex={selectedIndex}
          onSelect={handleSelectSuggestion}
          visible={showSuggestions}
          loading={loadingSuggestions}
        />
      </div>

      {showFilterButton && (
        <button
          onClick={onFilterToggle}
          type="button"
          className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border text-sm font-bold transition-all shrink-0 cursor-pointer ${
            filterActive
              ? 'bg-[#7A0B1A] text-[#D9CAB3] border-[#7A0B1A] shadow-sm'
              : 'bg-surface text-[#7A0B1A] border-slate-border hover:bg-[#D9CAB3]/40 hover:border-[#5B0712]/50'
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
