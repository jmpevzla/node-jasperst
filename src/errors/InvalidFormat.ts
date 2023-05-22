export class InvalidFormat extends Error {
  constructor(message = '') {
    super(message);
    this.message = message || 'INVALID_FORMAT';
    this.name = 'InvalidFormat';
  }
}