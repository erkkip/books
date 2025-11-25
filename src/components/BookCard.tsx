import React, { useState } from 'react';
import { Download, HardDrive, Clock, Lock } from 'lucide-react';
import { Book } from '@/types';

interface BookCardProps {
  book: Book;
  index: number;
  onDownload?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, index, onDownload }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (onDownload && book.downloadUrl) {
      setIsDownloading(true);
      try {
        await onDownload(book);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Check if download is available
  const isDownloadAvailable = !!book.downloadUrl;
  const isDisabled = isDownloading || !onDownload || !isDownloadAvailable;
  const showVipRequired = !isDownloadAvailable && book.vip === 1;

  return (
    <div
      className="relative w-full h-full animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card Container */}
      <div className="flex flex-col h-full bg-white border-4 border-neo-black shadow-neo hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all duration-200">
        
        {/* Header Color Strip */}
        <div className={`h-4 w-full ${book.coverColor} border-b-4 border-neo-black`}></div>

        <div className="p-6 flex flex-col flex-grow">
          {/* Title */}
          <div className="mb-2">
            <h3 className="text-xl font-display font-bold text-neo-black leading-tight uppercase tracking-tight">
              {book.title}
            </h3>
          </div>

          {/* Author - Subtitle style */}
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 italic">
              {typeof book.author === 'string' 
                ? book.author 
                : typeof book.author === 'object' 
                  ? Object.values(book.author).join(', ')
                  : 'Unknown Author'}
            </p>
          </div>

          {/* Formats/Tags */}
          <div className="flex-grow mb-6">
            <div className="flex flex-wrap gap-2">
              {book.formats.map((fmt, i) => {
                const fmtLower = fmt.toLowerCase().trim();
                const isHighlighted = fmtLower === 'eng' || fmtLower === 'epub';
                return (
                  <span 
                    key={`${fmt}-${i}`} 
                    className={`px-2 py-1 text-[10px] font-bold uppercase border-2 border-neo-black ${
                      isHighlighted 
                        ? 'bg-neo-yellow text-neo-black' 
                        : 'bg-neo-bg text-neo-black'
                    }`}
                  >
                    {fmt.trim()}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs font-bold text-neo-black mb-6 border-t-4 border-neo-black pt-4 border-dashed">
            <div className="flex items-center gap-2">
              <HardDrive size={14} />
              <span>{book.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{book.addedDate}</span>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDisabled}
            className={`w-full py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 border-4 border-neo-black transition-all duration-150 ${
              isDisabled
                ? isDownloading
                  ? 'bg-neo-green cursor-wait shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                  : 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-neo-yellow hover:bg-neo-pink shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
            }`}
          >
            {isDownloading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-neo-black border-t-transparent rounded-full"></div>
                LOADING...
              </>
            ) : showVipRequired ? (
              <>
                <Lock size={18} />
                VIP
              </>
            ) : (
              <>
                {book.vip === 1 && <Lock size={18} />}
                <Download size={18} />
                DOWNLOAD
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

