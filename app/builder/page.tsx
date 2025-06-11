'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  BookOpen,
  Search,
  Upload,
  Sparkles,
  Download,
  ArrowLeft,
  RotateCcw,
  Plus,
  Image as ImageIcon,
  X,
  FileText,
  Send,
  Book,
  Loader2,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import Link from 'next/link';
import BookSearch from '@/components/BookSearch';
import ShelfPreview from '@/components/ShelfPreview';
import PrintableLayout from '@/components/PrintableLayout';
import { Book as BookType, Spine } from '@/types/book';
import { apiClient } from '@/lib/api';
import PDFGenerator from '@/lib/pdfGenerator';

export default function Builder() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [spines, setSpines] = useState<Spine[]>([]);
  const [currentBook, setCurrentBook] = useState<Partial<BookType>>({
    title: '',
    author: '',
    coverImage: ''
  });
  const [currentSpine, setCurrentSpine] = useState<Partial<Spine>>({
    text: '',
    image: ''
  });
  const [searchMode, setSearchMode] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingToCollab, setIsSendingToCollab] = useState(false);
  const [mounted, setMounted] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    if (!mounted) return;

    try {
      const savedBooks = localStorage.getItem('myminishelf-books');
      const savedSpines = localStorage.getItem('myminishelf-spines');

      if (savedBooks) {
        const parsedBooks = JSON.parse(savedBooks);
        if (Array.isArray(parsedBooks)) {
          setBooks(parsedBooks);
        }
      }
      if (savedSpines) {
        const parsedSpines = JSON.parse(savedSpines);
        if (Array.isArray(parsedSpines)) {
          setSpines(parsedSpines);
        }
      }
    } catch (e) {
      console.error('Error loading saved data:', e);
    }
  }, [mounted]);

  // Save to localStorage when books or spines change
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem('myminishelf-books', JSON.stringify(books));
    } catch (e) {
      console.error('Error saving books:', e);
    }
  }, [books, mounted]);

  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem('myminishelf-spines', JSON.stringify(spines));
    } catch (e) {
      console.error('Error saving spines:', e);
    }
  }, [spines, mounted]);

  const handleBookSelect = (selectedBook: any) => {
    setCurrentBook({
      title: selectedBook.title || '',
      author: selectedBook.authors?.[0] || '',
      coverImage: selectedBook.imageLinks?.thumbnail || selectedBook.imageLinks?.smallThumbnail || ''
    });
    setSearchMode(false);
  };

  const addBookToList = () => {
    if (!currentBook.title?.trim() || !currentBook.author?.trim()) {
      alert('Please enter both title and author');
      return;
    }

    if (books.length >= 8) {
      alert('Maximum 8 books allowed');
      return;
    }

    const newBook: BookType = {
      id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: currentBook.title.trim(),
      author: currentBook.author.trim(),
      coverImage: currentBook.coverImage || ''
    };

    setBooks(prevBooks => [...prevBooks, newBook]);
    setCurrentBook({ title: '', author: '', coverImage: '' });
  };

  const addSpineToList = () => {
    if (!currentSpine.text?.trim() && !currentSpine.image) {
      alert('Please enter text or upload an image for the spine');
      return;
    }

    if (spines.length >= 6) {
      alert('Maximum 6 spines allowed');
      return;
    }

    const newSpine: Spine = {
      id: `spine-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: currentSpine.text?.trim() || '',
      image: currentSpine.image || ''
    };

    setSpines(prevSpines => [...prevSpines, newSpine]);
    setCurrentSpine({ text: '', image: '' });
  };

  /* const generateAICover = async () => {
     if (!currentBook.title?.trim() || !currentBook.author?.trim()) {
       alert('Please enter title and author first');
       return;
     }
 
     setIsGeneratingCover(true);
     try {
       const { coverUrl } = await apiClient.generateCover(
         currentBook.title,
         currentBook.author
       );
       setCurrentBook(prev => ({ ...prev, coverImage: coverUrl }));
     } catch (error) {
       console.error('Error generating cover:', error);
       alert('Failed to generate cover. Please try again.');
     } finally {
       setIsGeneratingCover(false);
     }
   };
 */
  const handleImageUpload = (file: File, type: 'book' | 'spine') => {
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'book') {
        setCurrentBook(prev => ({ ...prev, coverImage: result }));
      } else {
        setCurrentSpine(prev => ({ ...prev, image: result }));
      }
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const removeBook = (bookId: string) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
  };

  const removeSpine = (spineId: string) => {
    setSpines(prevSpines => prevSpines.filter(spine => spine.id !== spineId));
  };

  const resetAll = () => {
    if (books.length === 0 && spines.length === 0) return;

    if (confirm('Are you sure you want to reset everything? This will remove all books and spines.')) {
      setBooks([]);
      setSpines([]);
      setCurrentBook({ title: '', author: '', coverImage: '' });
      setCurrentSpine({ text: '', image: '' });

      if (mounted) {
        try {
          localStorage.removeItem('myminishelf-books');
          localStorage.removeItem('myminishelf-spines');
        } catch (e) {
          console.error('Error clearing localStorage:', e);
        }
      }
    }
  };

  const generatePDF = async () => {
    if (books.length === 0 && spines.length === 0) {
      alert('Please add some books or spines before downloading');
      return;
    }

    if (!printableRef.current) {
      alert('Print layout not ready. Please try again.');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await PDFGenerator.generatePDF(printableRef.current, {
        filename: `MyMiniShelf-Design-${Date.now()}.pdf`,
        quality: 2
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const sendToCollab = async () => {
    if (books.length === 0 && spines.length === 0) {
      alert('Please add some books or spines before sending to DaliCollab');
      return;
    }

    setIsSendingToCollab(true);
    try {
      //const { id } = '1'// await apiClient.saveShelf(books, spines); ${id}\n\n
      alert(`Design saved successfully! Reference ID: DaliCollab will contact you within 24 hours for production details.`);
    } catch (error) {
      console.error('Error sending to DaliCollab:', error);
      alert('Error sending to DaliCollab. Please try again or contact support@dalicollab.com');
    } finally {
      setIsSendingToCollab(false);
    }
  };

  // Handle drag reordering
  const handleBooksReorder = (newBooks: BookType[]) => {
    setBooks(newBooks);
  };

  const handleSpinesReorder = (newSpines: Spine[]) => {
    setSpines(newSpines);
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg h-96"></div>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg h-64"></div>
                <div className="bg-white rounded-2xl p-6 shadow-lg h-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-pink-500" />
                <h1 className="text-xl font-bold text-gray-800">Shelf Builder</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={resetAll}
                variant="outline"
                size="sm"
                disabled={books.length === 0 && spines.length === 0}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={generatePDF}
                variant="outline"
                disabled={isGeneratingPDF || (books.length === 0 && spines.length === 0)}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button
                onClick={sendToCollab}
                className="bg-dali-blue hover:bg-blue-600 text-white"
                disabled={isSendingToCollab || (books.length === 0 && spines.length === 0)}
              >
                {isSendingToCollab ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit to DaliCollab
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Bookshelf Preview */}
          <div className="order-2 lg:order-1">
            <ShelfPreview
              books={books}
              spines={spines}
              onBooksReorder={handleBooksReorder}
              onSpinesReorder={handleSpinesReorder}
            />
          </div>

          {/* Right Panel - Forms */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Books Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Books:</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="book-title">Book Title</Label>
                    <Input
                      id="book-title"
                      value={currentBook.title || ''}
                      onChange={(e) => setCurrentBook(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter book title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="book-author">Author</Label>
                    <Input
                      id="book-author"
                      value={currentBook.author || ''}
                      onChange={(e) => setCurrentBook(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Enter author name"
                    />
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleImageUpload(file, 'book');
                      };
                      input.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchMode(true)}
                  >
                    <Search className="h-4 w-4 mr-1" />
                    Search Book
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    //onClick={generateAICover}
                    disabled={isGeneratingCover || !currentBook.title?.trim() || !currentBook.author?.trim()}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    {isGeneratingCover ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </div>

                {currentBook.coverImage && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <ImageIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Cover image selected</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentBook(prev => ({ ...prev, coverImage: '' }))}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Button
                  onClick={addBookToList}
                  disabled={!currentBook.title?.trim() || !currentBook.author?.trim() || books.length >= 8}
                  className="w-full bg-dali-pink hover:bg-pink-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book to the List ({books.length}/8)
                </Button>
              </div>

              {/* Books List */}
              {books.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Added Books:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {books.map((book, index) => (
                      <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{book.title}</div>
                          <div className="text-xs text-gray-600 truncate">by {book.author}</div>
                          <div className="text-xs text-pink-500">
                            Shelf {index < 2 ? '1' : index < 3 ? '2' : index < 5 ? '3' : '4'} - Position {index < 2 ? index + 1 : index < 3 ? 1 : index < 5 ? index - 2 : index - 4}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBook(book.id)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Spine Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Spine</h3>

              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleImageUpload(file, 'spine');
                      };
                      input.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Upload Image
                  </Button>
                  <span className="text-gray-500 text-sm">or</span>
                </div>

                <div>
                  <Label htmlFor="spine-text">Type Text:</Label>
                  <Textarea
                    id="spine-text"
                    value={currentSpine.text || ''}
                    onChange={(e) => setCurrentSpine(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter spine text"
                    rows={3}
                  />
                </div>

                {currentSpine.image && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <ImageIcon className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Spine image selected</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentSpine(prev => ({ ...prev, image: '' }))}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Button
                  onClick={addSpineToList}
                  disabled={(!currentSpine.text?.trim() && !currentSpine.image) || spines.length >= 6}
                  className="w-full bg-dali-blue hover:bg-blue-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Spine to the List ({spines.length}/6)
                </Button>
              </div>

              {/* Spines List */}
              {spines.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Added Spines:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {spines.map((spine) => (
                      <div key={spine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm flex-1 min-w-0">
                          {spine.text ? (
                            <span className="truncate block">Text: {spine.text}</span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <ImageIcon className="h-4 w-4 flex-shrink-0" />
                              Image spine
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpine(spine.id)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Next Steps</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>📚 <strong>Add Books:</strong> Maximum 8 books arranged in 2-1-2-3 pattern</p>
                <p>📖 <strong>Add Spines:</strong> Maximum 6 custom spine elements</p>
                <p>🖱️ <strong>Drag to Rearrange:</strong> Click and drag books/spines to reposition</p>
                <p>📄 <strong>Download PDF:</strong> Get your design for DIY assembly (client-side generation)</p>
                <p>📦 <strong>Submit to DaliCollab:</strong> Professional production and shipping</p>
                <p>✉️ <strong>Need Changes?</strong> Contact support@dalicollab.com</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hidden Printable Layout for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <PrintableLayout ref={printableRef} books={books} spines={spines} />
      </div>

      {/* Book Search Modal */}
      <AnimatePresence>
        {searchMode && (
          <BookSearch
            onSelect={handleBookSelect}
            onClose={() => setSearchMode(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}