type Entries<T> = Array<keyof T extends infer U ? (U extends keyof T ? [U, T[U]] : never) : never>;

export function entries<T extends object>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>;
}

export function splitEntry<T extends object>(obj: T) {
  const [key, value] = Object.entries(obj)[0] as [keyof T, T[keyof T]];
  return { key, value };
}
