'use client';

import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Book, Spine } from '@/types/book';
import { BookOpen, FileText, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShelfPreviewProps {
  books: Book[];
  spines: Spine[];
  onBooksReorder?: (newBooks: Book[]) => void;
  onSpinesReorder?: (newSpines: Spine[]) => void;
}

type AlignmentType = 'left' | 'center' | 'right';

export default function ShelfPreview({ books, spines, onBooksReorder, onSpinesReorder }: ShelfPreviewProps) {
  const [draggedBooks, setDraggedBooks] = useState(books);
  const [draggedSpines, setDraggedSpines] = useState(spines);
  const [shelfAlignments, setShelfAlignments] = useState<AlignmentType[]>(['left', 'left', 'right', 'center']);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update local state when props change
  useEffect(() => {
    setDraggedBooks(books);
  }, [books]);

  useEffect(() => {
    setDraggedSpines(spines);
  }, [spines]);

  // Load alignment preferences from localStorage
  useEffect(() => {
    if (!mounted) return;
    
    const savedAlignments = localStorage.getItem('myminishelf-alignments');
    if (savedAlignments) {
      try {
        const parsedAlignments = JSON.parse(savedAlignments);
        if (Array.isArray(parsedAlignments) && parsedAlignments.length === 4) {
          setShelfAlignments(parsedAlignments);
        }
      } catch (e) {
        console.error('Error loading saved alignments:', e);
      }
    }
  }, [mounted]);

  // Save alignment preferences to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('myminishelf-alignments', JSON.stringify(shelfAlignments));
  }, [shelfAlignments, mounted]);

  const updateShelfAlignment = (shelfIndex: number, alignment: AlignmentType) => {
    setShelfAlignments(prev => {
      const newAlignments = [...prev];
      newAlignments[shelfIndex] = alignment;
      return newAlignments;
    });
  };

  const getAlignmentClass = (alignment: AlignmentType) => {
    switch (alignment) {
      case 'left': return 'justify-start';
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      default: return 'justify-start';
    }
  };

  const getAlignmentIcon = (alignment: AlignmentType) => {
    switch (alignment) {
      case 'left': return AlignLeft;
      case 'center': return AlignCenter;
      case 'right': return AlignRight;
      default: return AlignLeft;
    }
  };

  // Organize items across 4 shelves with 1,2,2,3 pattern for books
  const organizeShelfItems = () => {
    const shelves = [[], [], [], []] as any[][];
    const booksPerShelf = [2, 1, 2, 3]; // 1,2,2,3 pattern for 8 books total
    
    // Distribute books according to the pattern
    let bookIndex = 0;
    booksPerShelf.forEach((count, shelfIndex) => {
      for (let i = 0; i < count && bookIndex < draggedBooks.length; i++) {
        shelves[shelfIndex].push({ 
          ...draggedBooks[bookIndex], 
          type: 'book', 
          originalIndex: bookIndex,
          shelfIndex,
          positionInShelf: i
        });
        bookIndex++;
      }
    });
    
    // Add remaining books to the last shelf if any
    while (bookIndex < draggedBooks.length) {
      shelves[3].push({ 
        ...draggedBooks[bookIndex], 
        type: 'book', 
        originalIndex: bookIndex,
        shelfIndex: 3,
        positionInShelf: shelves[3].filter(item => item.type === 'book').length
      });
      bookIndex++;
    }
    
    // Add spines to shelves (distribute evenly, avoiding overcrowding)
    draggedSpines.forEach((spine, index) => {
      const shelfIndex = index % 4;
      // Only add if shelf has space (max 5 items per shelf)
      if (shelves[shelfIndex].length < 5) {
        shelves[shelfIndex].push({ 
          ...spine, 
          type: 'spine', 
          originalIndex: index,
          shelfIndex,
          positionInShelf: shelves[shelfIndex].length
        });
      }
    });
    
    return shelves;
  };

  const shelves = organizeShelfItems();

  const handleReorder = (shelfIndex: number, newOrder: any[]) => {
    const books = newOrder.filter(item => item.type === 'book');
    const spines = newOrder.filter(item => item.type === 'spine');
    
    // Update books order
    if (books.length > 0) {
      const newBookOrder = [...draggedBooks];
      books.forEach((book, index) => {
        const originalIndex = book.originalIndex;
        if (originalIndex !== undefined && originalIndex < newBookOrder.length) {
          newBookOrder[originalIndex] = { ...book, id: book.id, title: book.title, author: book.author, coverImage: book.coverImage };
        }
      });
      setDraggedBooks(newBookOrder);
      onBooksReorder?.(newBookOrder);
    }
    
    // Update spines order
    if (spines.length > 0) {
      const newSpineOrder = [...draggedSpines];
      spines.forEach((spine, index) => {
        const originalIndex = spine.originalIndex;
        if (originalIndex !== undefined && originalIndex < newSpineOrder.length) {
          newSpineOrder[originalIndex] = { ...spine, id: spine.id, text: spine.text, image: spine.image };
        }
      });
      setDraggedSpines(newSpineOrder);
      onSpinesReorder?.(newSpineOrder);
    }
  };

  const renderShelfItem = (item: any, itemIndex: number, shelfIndex: number) => {
    const globalIndex = shelfIndex * 4 + itemIndex;
    
    return (
      <Reorder.Item
        key={`${item.type}-${item.id}-${shelfIndex}-${itemIndex}`}
        value={item}
        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ 
          delay: globalIndex * 0.1,
          duration: 0.5,
          type: "spring",
          stiffness: 100
        }}
        className="relative group cursor-grab active:cursor-grabbing"
        whileDrag={{ scale: 1.05, zIndex: 50 }}
      >
        {item.type === 'book' && (
          <div className="book-cover w-16 h-24 bg-white border border-gray-300 overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
            {item.coverImage ? (
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.fallback-cover') as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className={`fallback-cover w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center justify-center p-2 ${item.coverImage ? 'hidden' : 'flex'}`}>
              <BookOpen className="h-6 w-6 text-white mb-1" />
              <div className="text-white text-xs text-center font-medium leading-tight">
                {item.title && item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title || 'Book'}
              </div>
            </div>
            
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2  text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
              <div className="font-semibold">{item.title || 'Untitled'}</div>
              <div className="opacity-80">by {item.author || 'Unknown'}</div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
            </div>
          </div>
        )}

        {item.type === 'spine' && (
          <div className="w-6 h-24 bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt="Spine decoration"
                className="w-full h-full object-cover rounded-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.fallback-spine') as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div className={`fallback-spine text-center w-full h-full flex flex-col items-center justify-center ${item.image ? 'hidden' : 'flex'}`}>
              <FileText className="h-4 w-4 text-amber-600 mb-1" />
              <div className="text-xs text-amber-700 font-medium transform rotate-90 origin-center whitespace-nowrap px-1">
                {item.text?.substring(0, 12) || 'Spine'}
              </div>
            </div>
            
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none">
              {item.text || 'Custom spine'}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
            </div>
          </div>
        )}
      </Reorder.Item>
    );
  };

  // Create empty slots for visual feedback
  const renderEmptySlot = (shelfIndex: number, slotIndex: number) => (
    <div 
      key={`empty-${shelfIndex}-${slotIndex}`}
      className="w-16 h-24 border-2 border-dashed border-white/30 rounded-sm flex items-center justify-center"
    >
      <span className="text-white/50 text-xs">Empty</span>
    </div>
  );

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Bookshelf Preview</h3>
        <div className="flex justify-center">
          <div className="w-[450px] h-[600px] bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-lg sticky top-24"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Bookshelf Preview</h3>
      
      {/* Alignment Controls */}
      <div className="mb-6 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Shelf Alignment:</h4>
        <div className="grid grid-cols-4 gap-2">
          {shelfAlignments.map((alignment, shelfIndex) => {
            const booksPerShelf = [2, 1, 2, 3];
            const currentBooks = shelves[shelfIndex]?.filter(item => item.type === 'book').length || 0;
            
            return (
              <div key={shelfIndex} className="text-center">
                <div className="text-xs text-gray-500 mb-1">
                  Shelf {shelfIndex + 1} ({currentBooks}/{booksPerShelf[shelfIndex]})
                </div>
                <div className="flex gap-1">
                  {(['left', 'center', 'right'] as AlignmentType[]).map((alignType) => {
                    const IconComponent = getAlignmentIcon(alignType);
                    return (
                      <Button
                        key={alignType}
                        variant={alignment === alignType ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateShelfAlignment(shelfIndex, alignType)}
                      >
                        <IconComponent className="h-3 w-3" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center">
        <div 
          className="relative rounded-lg shadow-2xl overflow-hidden"
          style={{
            backgroundImage: `url('/Bookshelf (2).png')`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '450px',
            height: '600px',
            minHeight: '600px'
          }}
        >
          {/* 4 shelves positioned to match the background image */}
          <div className="relative z-10 h-full flex flex-col px-16 py-8 gap-4">
            {shelves.map((shelfItems, shelfIndex) => {
              const booksPerShelf = [2, 1, 2, 3];
              const maxBooksForShelf = booksPerShelf[shelfIndex];
              const currentBooks = shelfItems.filter(item => item.type === 'book');
              const currentSpines = shelfItems.filter(item => item.type === 'spine');
              const alignment = shelfAlignments[shelfIndex];
              
              return (
                <Reorder.Group
                  key={`shelf-${shelfIndex}`}
                  axis="x"
                  values={shelfItems}
                  onReorder={(newOrder) => handleReorder(shelfIndex, newOrder)}
                  className={`flex items-end gap-3 px-8 h-32 ${getAlignmentClass(alignment)}`}
                >
                  {/* Render actual items */}
                  {shelfItems.map((item, itemIndex) => 
                    renderShelfItem(item, itemIndex, shelfIndex)
                  )}
                  
                  {/* Render empty slots for books if needed */}
                  {Array.from({ length: Math.max(0, maxBooksForShelf - currentBooks.length) }).map((_, index) =>
                    renderEmptySlot(shelfIndex, currentBooks.length + index)
                  )}
                </Reorder.Group>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Stats and Instructions */}
      <div className="mt-6 text-center">
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="bg-pink-50 rounded-lg p-3">
            <div className="font-semibold text-pink-700">Books</div>
            <div className="text-pink-600">{books.length}/8</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="font-semibold text-blue-700">Spines</div>
            <div className="text-blue-600">{spines.length}/6</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div>📚 Books arranged in 1-2-2-3 pattern across shelves</div>
          <div>🎯 Use alignment controls to position books on each shelf</div>
          <div>🖱️ Drag books and spines to rearrange them</div>
          <div>✨ Hover over items to see details</div>
        </div>
        
        {/* Shelf pattern indicator */}
        <div className="mt-4 flex justify-center gap-2">
          {[2, 1, 2, 3].map((count, index) => (
            <div key={index} className="flex gap-1">
              {Array.from({ length: count }).map((_, bookIndex) => (
                <div 
                  key={bookIndex}
                  className={`w-3 h-4 rounded-sm ${
                    books[index === 0 ? 0 : [2, 1, 2, 3].slice(0, index).reduce((a, b) => a + b, 0) + bookIndex] 
                      ? 'bg-pink-400' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
              {index < 3 && <div className="w-px h-4 bg-gray-300 mx-1" />}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}