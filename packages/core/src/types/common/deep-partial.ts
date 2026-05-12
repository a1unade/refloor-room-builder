/**
 * Частичное использование конфига настроек
 *
 * @public
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
