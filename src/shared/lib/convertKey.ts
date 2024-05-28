type Value = object | number | string;

/**
 * Строка индексации определённого типа
 */
export type KeyString<T> = string & { type: T };

/**
 * Преобразуем объект параметров в строку индексации
 * @param value
 * @returns
 */
export function toKey<T extends Value>(value: T): KeyString<T> {
  return JSON.stringify(value) as KeyString<T>;
}

/**
 * Преобразуем строку индексации в объект параметров
 */
export const keyToValue = <T extends Value>(keyString: KeyString<T>): T =>
  JSON.parse(keyString);
