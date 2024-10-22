const getDurationInMilliseconds = (start: [number, number]): number => {
  const NS_PER_SEC = 1e9; // Number of nanoseconds in one second
  const NS_TO_MS = 1e6; // Number of nanoseconds in one millisecond
  const diff = process.hrtime(start); // Get the difference in [seconds, nanoseconds]

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS; // Convert to milliseconds
};

export { getDurationInMilliseconds };
