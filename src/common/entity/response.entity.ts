export class ResponseEntity<T> {
  constructor(data: T, message?: string) {
    Object.assign(this, {
      message: message || 'Success',
      data,
    });
  }
}
