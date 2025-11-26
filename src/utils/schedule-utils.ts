export const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return NaN
  return h * 60 + m
}

export const rangesOverlap = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean => {
  // Overlap rule:
  // A.start < B.end AND B.start < A.end
  return aStart < bEnd && bStart < aEnd
}
