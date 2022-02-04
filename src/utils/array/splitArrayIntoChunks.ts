export function splitArrayIntoChunks<T>(arr: T[], chunks: number): T[][] {
  const chunkCount = Math.abs(chunks);

  const itemsPerChunk = Array(chunkCount).fill(0);
  arr.forEach((_item, index) => {
    itemsPerChunk[index % chunkCount] += 1;
  });

  const arrayCopy = [...arr];

  return itemsPerChunk.map(chunkSize => arrayCopy.splice(0, chunkSize));
}
