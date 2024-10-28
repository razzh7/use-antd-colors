export function line(vi, vlength, ci, clength) {
  return (vi === vlength - 1 && ci === clength - 1) ? '' : '\n';
}
