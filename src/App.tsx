import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Settings, X, Book as BookIcon, BookText,BookOpen, BookOpenText } from 'lucide-react';
import { Book } from '@/types';
import BookCard from '@/components/BookCard';
import SettingsPanel from '@/components/SettingsPanel';
import Toast from '@/components/Toast';
import Client from '@/utils/client';
import { transformApiBookToBook, ApiBookResponse } from '@/utils/bookTransform';

// Background Animation Component
const BackgroundIcons: React.FC = () => {
  const icons = [BookIcon, BookText, BookOpen, BookOpenText];
  const colors = ['#FFD900', '#FF90E8', '#28F48D', '#9980FA', '#4DA6FF'];
  
  // Generate random items only once on mount
  const items = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const Icon = icons[Math.floor(Math.random() * icons.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 40) + 30; // 30px to 70px
      const left = Math.floor(Math.random() * 95); // 0% to 95%
      const duration = Math.floor(Math.random() * 15) + 15; // 15s to 30s
      const delay = Math.floor(Math.random() * 20) * -1; // negative delay to start mid-air
      
      return {
        id: i,
        Icon,
        color,
        size,
        style: {
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute -bottom-20 animate-float opacity-60"
          style={item.style}
        >
          <item.Icon 
            size={item.size} 
            color="#0e1111" 
            fill={item.color} 
            strokeWidth={2.5}
            className="drop-shadow-[4px_4px_0px_rgba(14,17,17,1)]"
          />
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mamId, setMamId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const apiClient = useMemo(() => new Client(), []);

  const hasQuery = query.trim().length > 0;

  // Load mamid from backend on mount
  useEffect(() => {
    const loadMamId = async () => {
      try {
        const response = await fetch('api/v1/mamid');
        const data = await response.json();
        if (data.mamid) {
          setMamId(data.mamid);
        }
      } catch (err) {
        console.error('Failed to load mamid:', err);
      }
    };
    loadMamId();
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setBooks([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.search(searchQuery);
      
      // Handle different response formats
      let booksData: ApiBookResponse[] = [];
      
      if (Array.isArray(response)) {
        booksData = response;
      } else if (response && typeof response === 'object') {
        // Check if response has a data property or similar
        if (response.data && Array.isArray(response.data)) {
          booksData = response.data;
        } else if (response.results && Array.isArray(response.results)) {
          booksData = response.results;
        } else if (response.torrents && Array.isArray(response.torrents)) {
          booksData = response.torrents;
        } else {
          // Try to find any array in the response
          const keys = Object.keys(response);
          for (const key of keys) {
            if (Array.isArray(response[key])) {
              booksData = response[key];
              break;
            }
          }
        }
      }

      if (booksData.length > 0) {
        const transformedBooks = booksData.map((apiBook, index) => 
          transformApiBookToBook(apiBook, index)
        );
        setBooks(transformedBooks);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
      const errorMessage = 'Failed to search. Please try again.';
      setError(errorMessage);
      setShowToast(true);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce search - wait 500ms after user stops typing
    const timeout = setTimeout(() => {
      performSearch(val);
    }, 500);

    setSearchTimeout(timeout);
  };

  const clearSearch = () => {
    setQuery('');
    setBooks([]);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  const handleSaveToken = async (token: string) => {
    try {
      await apiClient.setMamid(token);
      setMamId(token);
      console.log("MamId saved successfully");
    } catch (err) {
      console.error("Failed to save mamId:", err);
      const errorMessage = 'Failed to save token. Please try again.';
      setError(errorMessage);
      setShowToast(true);
    }
  };

  const handleDownload = async (book: Book) => {
    if (!book.downloadUrl) {
      console.error('No download URL available');
      return;
    }

    try {
      const response = await apiClient.download(book.downloadUrl);
      if (response.ok || response.status === 204) {
        console.log('Download initiated successfully');
      } else {
        console.error('Download failed:', response.status);
        const errorMessage = 'Download failed. Please try again.';
        setError(errorMessage);
        setShowToast(true);
      }
    } catch (err) {
      console.error('Download error:', err);
      const errorMessage = 'Download failed. Please try again.';
      setError(errorMessage);
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-neo-pink selection:text-neo-black overflow-x-hidden flex flex-col">
      
      {/* Animated Background */}
      <BackgroundIcons />

      {/* Settings Button - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-white border-4 border-neo-black shadow-neo hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-neo-purple transition-all duration-200 group"
          aria-label="Settings"
        >
          <Settings size={24} className="text-neo-black" strokeWidth={2.5} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className={`relative z-10 flex-grow flex flex-col transition-all duration-500 ease-in-out ${hasQuery ? 'pt-20 px-6 md:px-12' : 'justify-center items-center p-6'}`}>
        
        {/* Search Wrapper */}
        <div className={`w-full max-w-4xl flex flex-col transition-all duration-500 ${hasQuery ? 'translate-y-0' : 'translate-y-0'}`}>
          
          {/* Search Bar */}
          <div className="relative group w-full">
            <div className={`relative flex items-center bg-white border-4 border-neo-black shadow-neo-lg transition-all focus-within:shadow-neo focus-within:translate-x-[4px] focus-within:translate-y-[4px]`}>
              <div className="pl-6 text-neo-black">
                <Search size={32} strokeWidth={3} />
              </div>
              <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="SEARCH BOOKS..."
                className="w-full bg-transparent text-2xl md:text-4xl px-4 py-6 md:py-8 text-neo-black placeholder-gray-400 focus:outline-none font-display font-bold uppercase tracking-tight"
                autoFocus
                disabled={isLoading}
              />
              {query && (
                <button 
                  onClick={clearSearch}
                  className="pr-6 text-neo-black hover:text-neo-pink transition-colors"
                  disabled={isLoading}
                >
                  <X size={32} strokeWidth={3} />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Results Grid - Only visible when hasQuery is true */}
        {hasQuery && (
          <div className="w-full max-w-7xl mx-auto mt-16 animate-slide-up">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block bg-white border-4 border-neo-black p-8 shadow-neo">
                  <p className="text-2xl text-neo-black font-display font-bold">SEARCHING...</p>
                </div>
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
                {books.map((book, index) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    index={index}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-block bg-white border-4 border-neo-black p-8 shadow-neo rotate-2">
                  <p className="text-2xl text-neo-black font-display font-bold">NO RESULTS FOUND FOR "{query}"</p>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        initialToken={mamId}
        onSaveToken={handleSaveToken}
      />

      <Toast 
        message={error || ''} 
        isVisible={showToast && error !== null}
        onClose={() => {
          setShowToast(false);
          setError(null);
        }}
      />
    </div>
  );
};

export default App;
