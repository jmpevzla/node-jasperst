export class InvalidResourceDirectory extends Error {
  constructor(message = '') {
    super(message);
    this.message = message || 'INVALID_RESOURCE_DIRECTORY';
    this.name = 'InvalidResourceDirectory';
  }
}