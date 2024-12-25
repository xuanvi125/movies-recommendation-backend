export class UserNotFoundException extends Error {
  constructor(message: string = 'Cannot find user with the provided email') {
    super(message);
    this.name = 'UserNotFoundException';
  }
}
