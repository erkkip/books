export interface Book {
  id: string;
  title: string;
  author: string;
  size: string;
  addedDate: string;
  formats: string[];
  coverColor: string; // For the dynamic UI
  downloadUrl?: string;
  vip?: number;
}

export interface Settings {
  apiKey: string;
}

