export function getShortAddress(address: string, lengthBeforeElipsis: number = 6) {
  return `${address.substr(0, lengthBeforeElipsis)}...${address.substr(-4, 4)}`;
}
