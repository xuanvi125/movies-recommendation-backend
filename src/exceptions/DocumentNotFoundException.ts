class DocumentNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DocumentNotFoundException';
  }
}

export default DocumentNotFoundException;
