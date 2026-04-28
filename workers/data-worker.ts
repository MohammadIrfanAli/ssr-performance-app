// workers/data-worker.ts

self.onmessage = (e: MessageEvent) => {
  const { type, data } = e.data;

  if (type === 'hash') {
    const hash = djb2Hash(JSON.stringify(data));
    self.postMessage({ type: 'hash_result', hash });
  }
};

function djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = Math.trunc(hash);
  }
  return (hash >>> 0).toString(16);
}
