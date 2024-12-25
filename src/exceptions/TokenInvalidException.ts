export class TokenInvalidException extends Error {
  constructor(message: string = 'Token is invalid') {
    super(message);
    this.name = 'TokenInvalidException';
  }
}
