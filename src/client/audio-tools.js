export const getLogFrequencyRatio = (freq, minFreq, maxFreq) => (
  Math.log10(freq / minFreq) /
  Math.log10(maxFreq / minFreq)
);
