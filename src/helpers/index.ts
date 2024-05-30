export function isEmpty(obj: Record<string, any>) {
  obj = obj || {};
  return Object.keys(obj).length === 0;
}
