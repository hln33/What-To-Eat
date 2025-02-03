export const setsEqual = <T>(a: Set<T>, b: Set<T>) =>
  a.symmetricDifference(b).size === 0;
