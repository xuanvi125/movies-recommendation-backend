export class VoteMovieException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VoteMovieException';
  }
}