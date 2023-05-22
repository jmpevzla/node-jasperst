export class InvalidCommandExecutable extends Error {
  constructor(message = '') {
    super(message);
    this.message = message || 'INVALID_COMMAND_EXECUTABLE';
    this.name = 'InvalidCommandExecutable';
  }
}