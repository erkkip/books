import { Book } from '@/types';
import { COVER_COLORS } from '@/constants';
import moment from 'moment';

// API response type from MyAnonamouse
export interface ApiBookResponse {
  id?: number;
  title: string;
  author_info: string;
  filetype: string;
  dl: string | null;
  lang_code: string;
  size: string;
  added: string;
  vip?: number;
  [key: string]: any; // Allow other fields
}

// Transform API response to Book type
export function transformApiBookToBook(apiBook: ApiBookResponse, index: number): Book {
  // Parse formats from filetype (could be comma-separated)
  const formats = apiBook.filetype ? apiBook.filetype.split(',').map(f => f.trim()) : [];
  
  // Add language code to formats if present
  if (apiBook.lang_code) {
    formats.push(apiBook.lang_code.toUpperCase());
  }

  // Format date (apiBook.added might be a timestamp or date string)
  const addedDate = formatDate(apiBook.added);

  // Assign cover color based on index
  const coverColor = COVER_COLORS[index % COVER_COLORS.length];

  // Parse author_info - it's a JSON string that needs to be parsed
  // Example: "{\"4976\":\"Stephen King\"}" or "{\"485\":\"Richard Bachman\",\"4976\":\"Stephen King\"}"
  let author = 'Unknown Author';
  if (apiBook.author_info) {
    if (typeof apiBook.author_info === 'string') {
      try {
        // Try to parse as JSON
        const parsed = JSON.parse(apiBook.author_info);
        if (typeof parsed === 'object' && parsed !== null) {
          // Extract values from the object and join with commas
          author = Object.values(parsed).join(', ');
        } else {
          // If parsed value is not an object, use the original string
          author = apiBook.author_info;
        }
      } catch (e) {
        // If JSON parsing fails, use the string as-is
        author = apiBook.author_info;
      }
    } else if (typeof apiBook.author_info === 'object') {
      // If it's already an object (shouldn't happen, but handle it)
      author = Object.values(apiBook.author_info).join(', ');
    }
  }

  // Handle null dl values - set downloadUrl to undefined when dl is null
  const downloadUrl = apiBook.dl || undefined;
  
  // Use fallback ID when dl is null (use apiBook.id if available, otherwise generate one)
  const id = apiBook.dl || (apiBook.id ? `book-${apiBook.id}` : `book-${index}`);

  return {
    id: id,
    title: apiBook.title || 'Unknown Title',
    author: author,
    size: apiBook.size || 'Unknown Size',
    addedDate: addedDate,
    formats: formats.length > 0 ? formats : ['Unknown'],
    coverColor: coverColor,
    downloadUrl: downloadUrl,
    vip: apiBook.vip,
  };
}

function formatDate(dateString: string): string {
  if (!dateString) return 'Unknown date';
  
  try {
    // Try to parse as timestamp (numeric string)
    const timestamp = parseInt(dateString, 10);
    if (!isNaN(timestamp) && dateString.trim() === timestamp.toString()) {
      // It's a pure numeric string, treat as timestamp (assume seconds)
      const momentDate = moment.unix(timestamp);
      if (momentDate.isValid()) {
        return momentDate.fromNow();
      }
    }
    
    // Try to parse as date string (e.g., "2018-04-05 07:09:57")
    // Moment.js can handle MySQL datetime format directly
    const momentDate = moment(dateString);
    if (momentDate.isValid()) {
      return momentDate.fromNow();
    }
  } catch (e) {
    // If parsing fails, return as-is or a default
    console.warn('Failed to parse date:', dateString, e);
  }
  
  return dateString;
}

