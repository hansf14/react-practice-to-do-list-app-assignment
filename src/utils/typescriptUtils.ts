// https://stackoverflow.com/a/76927120/11941803
export type RequiredDeep<T> = Required<{
  [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : RequiredDeep<T[K]>;
}>;
