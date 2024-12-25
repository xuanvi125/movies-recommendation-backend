export class MovieListException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MovieListException';
  }
}
