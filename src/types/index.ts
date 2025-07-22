export interface Book {
  id?: string;               // id kan saknas i vissa poster
  name: string;              // titel
  description: string;
  genre: string;
  coverUrl: string;
  averageRating: number;
  userRating?: number;       // användarens betyg, kan vara undefined
  haveRead: number;
  currentlyReading: number;
  wantToRead: number;
}
