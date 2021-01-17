export default function(fns) {
  return fns.reduce((a, b) => b(a));
}
