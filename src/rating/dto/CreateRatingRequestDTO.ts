export class CreateRatingRequestDTO {
  movieId: string;
  rating: number;

  constructor(movieId: string, rating: number) {
    this.movieId = movieId;
    this.rating = rating;
  }
}
