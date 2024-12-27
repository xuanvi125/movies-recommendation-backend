export class MovieFilterRequestDTO {
  search?: string;
  genres?: string[];
  rating?: number;
  trending?: 'today' | 'week';
  release_date?: string;
  page?: number;
  limit?: number;
}
