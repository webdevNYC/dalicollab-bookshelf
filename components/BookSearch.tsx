'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Search, Book, Loader2 } from 'lucide-react';
import { GoogleBooksItem } from '@/types/book';
import { apiClient } from '@/lib/api';

interface BookSearchProps {
  onSelect: (book: GoogleBooksItem['volumeInfo']) => void;
  onClose: () => void;
}

export default function BookSearch({ onSelect, onClose }: BookSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBooksItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  /*const searchBooks = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const data = await apiClient.searchBooks(searchQuery);
      setResults(data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };*/

  useEffect(() => {
    if (!mounted) return;

    const delayedSearch = setTimeout(() => {
      if (query.length > 2) {
        //searchBooks(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, mounted]);

  // Don't render until mounted
  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Search Books</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books by title, author, or ISBN..."
              className="pl-10 pr-4 py-3 text-lg"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelect(item.volumeInfo)}
                >
                  <div className="flex-shrink-0">
                    {item.volumeInfo.imageLinks?.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.volumeInfo.imageLinks.thumbnail}
                        alt={item.volumeInfo.title}
                        className="w-16 h-20 object-cover rounded shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.fallback-book') as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className={`fallback-book w-16 h-20 bg-gray-200 rounded flex items-center justify-center ${item.volumeInfo.imageLinks?.thumbnail ? 'hidden' : 'flex'}`}>
                      <Book className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {item.volumeInfo.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {item.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                    </p>
                    {item.volumeInfo.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {item.volumeInfo.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : query.length > 2 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Book className="h-12 w-12 mb-4" />
              <p>No books found for {query}</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Search className="h-12 w-12 mb-4" />
              <p>Start typing to search for books</p>
              <p className="text-sm">Search by title, author, or ISBN</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}