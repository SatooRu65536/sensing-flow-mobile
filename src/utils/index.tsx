type Entries<T> = Array<keyof T extends infer U ? (U extends keyof T ? [U, T[U]] : never) : never>;

export function entries<T extends Record<string, unknown>>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>;
}
