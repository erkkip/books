import { Book } from './types';

// Palette for generating random book cover backgrounds
export const COVER_COLORS = [
  'bg-neo-pink',
  'bg-neo-purple',
  'bg-neo-blue',
  'bg-neo-green',
  'bg-neo-yellow',
  'bg-orange-400',
];

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Stephen King Dutch Collection',
    author: 'Stephen King',
    size: '54.7 MiB',
    addedDate: '8 years ago',
    formats: ['epub', 'DUT'],
    coverColor: 'bg-neo-yellow',
  },
  {
    id: '2',
    title: 'Detectives, Adventure and Stephen King Collection',
    author: 'Leslie Charteris, Agatha Christie, Robert Crais...',
    size: '796.1 MiB',
    addedDate: '10 years ago',
    formats: ['azw3', 'epub', 'mobi', 'ENG'],
    coverColor: 'bg-neo-blue',
  },
  {
    id: '3',
    title: 'Coleção Stephen King',
    author: 'Stephen King',
    size: '50.3 MiB',
    addedDate: '8 years ago',
    formats: ['epub', 'pdf', 'POR'],
    coverColor: 'bg-neo-green',
  },
  {
    id: '4',
    title: 'Stephen King Collection (Complete)',
    author: 'Stephen King',
    size: '72.3 MiB',
    addedDate: '9 years ago',
    formats: ['epub', 'ENG'],
    coverColor: 'bg-neo-purple',
  },
  {
    id: '5',
    title: 'The Dark Tower Series',
    author: 'Stephen King',
    size: '120.5 MiB',
    addedDate: '2 years ago',
    formats: ['mobi', 'epub'],
    coverColor: 'bg-neo-pink',
  },
  {
    id: '6',
    title: 'It (Novel)',
    author: 'Stephen King',
    size: '4.2 MiB',
    addedDate: '5 years ago',
    formats: ['pdf'],
    coverColor: 'bg-orange-400',
  },
];

