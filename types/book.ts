export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
}

export interface Spine {
  id: string;
  text: string;
  image: string;
}

export interface GoogleBooksItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
    };
    description?: string;
    publishedDate?: string;
    publisher?: string;
  };
}

interface GoogleBooksResponse {
  items: GoogleBooksItem[];
  totalItems: number;
}