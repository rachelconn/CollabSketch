export default function getMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  var half = Math.floor(sorted.length/2);

  return sorted.length % 2 ? sorted[half] : (sorted[half-1] + sorted[half]) / 2.0;
}
