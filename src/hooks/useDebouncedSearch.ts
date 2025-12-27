import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

interface UseDebouncedSearchOptions {
  delay?: number;
  minLength?: number;
  onSearch: (query: string) => void;
}

export function useDebouncedSearch({
  delay = 500,
  minLength = 2,
  onSearch
}: UseDebouncedSearchOptions) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, delay);

  useEffect(() => {
    if (debouncedSearch.length >= minLength) {
      setIsSearching(true);
      onSearch(debouncedSearch);
      setIsSearching(false);
    } else if (debouncedSearch.length === 0) {
      onSearch('');
    }
  }, [debouncedSearch, minLength, onSearch]);

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    clearSearch,
    hasMinLength: searchTerm.length >= minLength
  };
}
