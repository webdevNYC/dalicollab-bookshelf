'use client';

import React, { forwardRef } from 'react';
import { Book, Spine } from '@/types/book';
import { BookOpen, FileText } from 'lucide-react';

interface PrintableLayoutProps {
  books: Book[];
  spines: Spine[];
}

const PrintableLayout = forwardRef<HTMLDivElement, PrintableLayoutProps>(
  ({ books, spines }, ref) => {
    return (
      <div 
        ref={ref}
        className="bg-white"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '10mm',
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          lineHeight: '1.4',
          color: '#000',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '8mm',
          borderBottom: '1px solid #ddd',
          paddingBottom: '5mm'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            margin: '0 0 3mm 0',
            color: '#1f2937'
          }}>
            MyMiniShelf Design
          </h1>
          <div style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5mm'
          }}>
            <span>Created: {new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>DaliCollab Production</span>
          </div>
        </div>

        {/* Books Section */}
        {books.length > 0 && (
          <div style={{ marginBottom: '10mm' }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '5mm',
              color: '#1f2937',
              borderLeft: '4px solid #ec4899',
              paddingLeft: '3mm'
            }}>
              Book Covers ({books.length}/8)
            </h2>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '5mm',
              marginBottom: '5mm'
            }}>
              {books.map((book, index) => (
                <div 
                  key={book.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '3mm',
                    padding: '3mm',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    minHeight: '40mm'
                  }}
                >
                  <div style={{ 
                    marginBottom: '2mm',
                    fontSize: '10px',
                    color: '#6b7280',
                    fontWeight: 'bold'
                  }}>
                    #{index + 1}
                  </div>
                  
                  {book.coverImage ? (
                    <div style={{
                      width: '100%',
                      height: '25mm',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '2mm',
                      marginBottom: '2mm',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #6b7280;">
                                <div style="margin-bottom: 1mm;">📚</div>
                                <div style="font-size: 8px;">Cover</div>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '25mm',
                      backgroundColor: '#3b82f6',
                      borderRadius: '2mm',
                      marginBottom: '2mm',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '16px', marginBottom: '1mm' }}>📚</div>
                      <div style={{ fontSize: '8px', textAlign: 'center' }}>
                        {book.title.length > 15 ? book.title.substring(0, 15) + '...' : book.title}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ 
                    fontSize: '9px',
                    fontWeight: 'bold',
                    marginBottom: '1mm',
                    lineHeight: '1.2'
                  }}>
                    {book.title.length > 25 ? book.title.substring(0, 25) + '...' : book.title}
                  </div>
                  <div style={{ 
                    fontSize: '8px',
                    color: '#6b7280'
                  }}>
                    by {book.author.length > 20 ? book.author.substring(0, 20) + '...' : book.author}
                  </div>
                </div>
              ))}
            </div>

            {/* Assembly Instructions for Books */}
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '2mm',
              padding: '3mm',
              fontSize: '10px'
            }}>
              <strong>📋 Book Assembly:</strong> Cut along the dotted lines. Fold covers and attach to miniature book spines. Arrange in 2-1-2-3 pattern across shelves.
            </div>
          </div>
        )}

        {/* Spines Section */}
        {spines.length > 0 && (
          <div style={{ marginBottom: '10mm' }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '5mm',
              color: '#1f2937',
              borderLeft: '4px solid #3b82f6',
              paddingLeft: '3mm'
            }}>
              Custom Spines ({spines.length}/6)
            </h2>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '5mm',
              marginBottom: '5mm'
            }}>
              {spines.map((spine, index) => (
                <div 
                  key={spine.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '3mm',
                    padding: '3mm',
                    textAlign: 'center',
                    backgroundColor: '#f0f9ff',
                    minHeight: '30mm'
                  }}
                >
                  <div style={{ 
                    marginBottom: '2mm',
                    fontSize: '10px',
                    color: '#6b7280',
                    fontWeight: 'bold'
                  }}>
                    Spine #{index + 1}
                  </div>
                  
                  {spine.image ? (
                    <div style={{
                      width: '100%',
                      height: '20mm',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '2mm',
                      marginBottom: '2mm',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={spine.image}
                        alt="Custom spine"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #6b7280;">
                                <div style="margin-bottom: 1mm;">🎨</div>
                                <div style="font-size: 8px;">Image</div>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '20mm',
                      backgroundColor: '#f59e0b',
                      borderRadius: '2mm',
                      marginBottom: '2mm',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: '1mm'
                    }}>
                      {spine.text || 'Custom Spine'}
                    </div>
                  )}
                  
                  {spine.text && (
                    <div style={{ 
                      fontSize: '9px',
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      "{spine.text.length > 30 ? spine.text.substring(0, 30) + '...' : spine.text}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Assembly Instructions for Spines */}
            <div style={{
              backgroundColor: '#dbeafe',
              border: '1px solid #3b82f6',
              borderRadius: '2mm',
              padding: '3mm',
              fontSize: '10px'
            }}>
              <strong>🔧 Spine Assembly:</strong> Cut and fold spine elements. Attach to bookshelf structure as decorative elements between books.
            </div>
          </div>
        )}

        {/* Assembly Guide */}
        <div style={{ marginBottom: '8mm' }}>
          <h2 style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            marginBottom: '4mm',
            color: '#1f2937'
          }}>
            📐 Assembly Instructions
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5mm',
            fontSize: '10px'
          }}>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '2mm', color: '#dc2626' }}>
                🔴 Step 1: Preparation
              </h3>
              <ul style={{ margin: 0, paddingLeft: '4mm' }}>
                <li>Cut along all dotted lines</li>
                <li>Score fold lines lightly</li>
                <li>Prepare adhesive (glue stick recommended)</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '2mm', color: '#059669' }}>
                🟢 Step 2: Assembly
              </h3>
              <ul style={{ margin: 0, paddingLeft: '4mm' }}>
                <li>Fold book covers and attach to spines</li>
                <li>Arrange books in 2-1-2-3 shelf pattern</li>
                <li>Add custom spine elements as desired</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          borderTop: '1px solid #ddd',
          paddingTop: '5mm',
          textAlign: 'center',
          fontSize: '10px',
          color: '#6b7280'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3mm',
            marginBottom: '2mm'
          }}>
            <div style={{ 
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#ec4899'
            }}>
              DaliCollab
            </div>
            <span>•</span>
            <span>MyMiniShelf Design</span>
          </div>
          <div>
            For professional production and shipping, visit dalicollab.com
          </div>
          <div style={{ marginTop: '1mm' }}>
            Questions? Contact support@dalicollab.com
          </div>
        </div>
      </div>
    );
  }
);

PrintableLayout.displayName = 'PrintableLayout';

export default PrintableLayout;