self.onmessage = (e: MessageEvent) => {
  const { limit } = e.data;
  const start = performance.now();
  
  const primes = calculatePrimes(limit);
  
  const end = performance.now();
  const duration = end - start;
  
  const workFactor = limit * Math.log(limit);
  const estimatedCPU = Math.min(100, (workFactor / (duration * 100)) * 10);

  self.postMessage({
    primesCount: primes.length,
    duration,
    estimatedCPU,
    lastPrime: primes[primes.length - 1]
  });
};

function calculatePrimes(limit: number): number[] {
  const primes = [];
  const sieve = new Uint8Array(limit + 1).fill(1);
  sieve[0] = sieve[1] = 0;

  for (let p = 2; p * p <= limit; p++) {
    if (sieve[p]) {
      for (let i = p * p; i <= limit; i += p)
        sieve[i] = 0;
    }
  }

  for (let p = 2; p <= limit; p++) {
    if (sieve[p]) primes.push(p);
  }

  return primes;
}
