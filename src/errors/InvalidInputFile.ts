export class InvalidInputFile extends Error {
  constructor(message = '') {
    super(message);
    this.message = message || 'INVALID_INPUT_FILE';
    this.name = 'InvalidInputFile';
  }
}