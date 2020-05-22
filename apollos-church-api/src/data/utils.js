export function logRequests(request) {
  this.callCount = this.callCount || 0;
  this.calls = this.calls || {};

  this.callCount += 1;

  const path = request.path.startsWith('http')
    ? request.path
    : this.baseURL + request.path;
  if (!this.calls[path]) {
    this.calls[path] = 0;
  }
  this.calls[path] = this.calls[path] + 1;
}
