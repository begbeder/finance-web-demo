/**
 * Преобразует регистр символов в указанной строке в "змеиный" регистр (напр. "snake_case").
 */
export function snakeCase(value: string): string {
  // Преобразование в snake_case взято отсюда:
  // https://stackoverflow.com/a/30521308/5877243

  const split = value.split(/[^a-zA-Zа-яА-Я0-9]/);

  const transformed = [];
  for (const word of split) {
    transformed.push(
      word.replace(/([A-ZА-Я]+)/g, (_, y: string) => "_" + y.toLowerCase())
          .replace(/^_/, ""),
    );
  }

  return transformed.join("_");
}

/**
 * Преобразует регистр символов в указанной строке в "верблюжий" регистр (напр. "camelCase").
 */
export function camelCase(value: string): string {
  const pascal = pascalCase(value);

  return pascal.substring(0, 1).toLowerCase() + pascal.substring(1);
}

/**
 * Преобразует регистр символов в указанной строке в регистр "паскаля" (напр. "PascalCase").
 */
export function pascalCase(value: string): string {
  const split = value.split(/[^a-zA-Zа-яА-Я0-9]/);

  const transformed = [];
  for (const word of split) {
    transformed.push(word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase());
  }

  return transformed.join("");
}

/**
 * Возвращает копию объекта только с полями из переданного списка.
 */
export function pick<T extends object>(object: T, fields: Array<keyof T> = []): Partial<T> {
  const filteredObject: Partial<T> = {};

  for (const field of fields) {
    if (object.hasOwnProperty(field)) {
      filteredObject[field] = object[field];
    }
  }

  return filteredObject;
}

/**
 * Возвращает переданное значение без изменений, если оно равно значению одного из полей указанного объекта.
 * Иначе возвращает значение параметра `defaultValue`.
 */
export function normalize<T>(object: { [key: string]: T }, value: T, defaultValue: T | null = null): T | null {
  for (const field in object) {
    if (object.hasOwnProperty(field) && object[field] === value) {
      return value;
    }
  }

  return defaultValue;
}

/**
 * Преобразует объект {Date} в строковое представление по стандарту ISO-8601 (Y-m-d H:i:s).
 *
 * {@link https://ru.wikipedia.org/wiki/ISO_8601}
 */
export function formatDateISO8601(value: Date): string {
  const components = [
    value.getFullYear(),
    ("00" + (value.getMonth() + 1)).slice(-2),
    ("00" + value.getDate()).slice(-2),
    ("00" + value.getHours()).slice(-2),
    ("00" + value.getMinutes()).slice(-2),
    ("00" + value.getSeconds()).slice(-2),
  ];

  return `${components[0]}-${components[1]}-${components[2]} ${components[3]}:${components[4]}:${components[5]}`;
}

/**
 * Обрабатывает указанный URL и возвращает массив доменов всех уровней, содержащихся в нем.
 */
export function parseDomain(fullUrl: string): string[] {
  const parts = fullUrl.match(/^(?:https?:\/\/)?([^/:]+)/i);
  if (parts && parts.length > 1) {
    const levels = parts[1].split(".");

    let result;
    if (levels.length > 1) {
      result = [];
      for (let i = 0; i < levels.length - 1; i++) {
        result.push(levels.slice(i).join("."));
      }

    } else {
      result = [levels[0]];
    }

    return result;
  }

  return [];
}

/**
 * Реализация Array.filter() для асинхронных предикатов.
 * Выполняет параллельно асинхронные проверки для всех элементов указанной коллекции и возвращает новый
 * массив, содержащий лишь те элементы, для которых проверка была пройдена.
 */
export async function filterAsync<T>(collection: Iterable<T>,
                                     predicate: (entry: T,
                                                 index: number,
                                                 array: Iterable<T>) => Promise<boolean>): Promise<T[]> {
  // взято из https://stackoverflow.com/a/33362966/5877243
  const copy = Array.from(collection);

  return Promise
    .all(copy.map((element: T, index: number) => predicate(element, index, copy)))
    .then((result: boolean[]) => {
      return copy.filter((entry: T, index: number) => result[index]);
    });
}

/**
 * Реализация Array.map() для асинхронных преобразований.
 * Выполняет параллельно асинхронные преобразования для всех элементов указанной коллекции и возвращает новый
 * массив с результатами этих преобразований.
 */
export async function mapAsync<T, R>(collection: Iterable<T>,
                                     transform: (entry: T,
                                                 index: number,
                                                 array: Iterable<T>) => Promise<R>): Promise<R[]> {
  const copy = Array.from(collection);

  return Promise.all(copy.map((element: T, index: number) => transform(element, index, copy)));
}

/**
 * Возвращает массив уникальных элементов из указанного массива.
 */
export function unique<T>(array: T[]): T[] {
  const result = array.slice();
  return result.filter((value, index, self) => self.indexOf(value) === index);
}

/**
 * Проверяет, является ли указанный объект простым словарем.
 * Словарем считается объект, хранящий по всем своим ключам значения одинакового типа, при этом не являющиеся функциями.
 */
export function isDictionary(object: IArbitraryObject): boolean {
  let firstType: string;
  return Object.keys(object).reduce((previousValue: boolean, currentKey: any) => {
    const value = object[currentKey];
    const type = typeof value === "object" ? value.constructor.name : typeof value;

    if (!firstType) {
      firstType = type;
    }

    return previousValue && type === firstType && type !== "function";
  }, true);
}

/**
 * Возвращает новый массив, содержащий элементы из указанного массива в случайном порядке.
 * Используется алгоритм Фишера-Йетса.
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = array.slice();

  let counter = shuffled.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = shuffled[counter];
    shuffled[counter] = shuffled[index];
    shuffled[index] = temp;
  }

  return shuffled;
}

/**
 * Устанавливает минимальный интервал между вызовами указанной функции.
 * Использует переданный объект в качестве монитора.
 */
export function debounce<T>(callback: () => T,
                            timeout: number,
                            timeoutHolder: { bounce?: boolean; bouncePreviousResult?: T; }): T {
  if (timeoutHolder.bounce) {
    return timeoutHolder.bouncePreviousResult!;
  }

  const result = callback();

  timeoutHolder.bounce = true;
  timeoutHolder.bouncePreviousResult = result;

  setTimeout(() => {
    timeoutHolder.bounce = false;
    timeoutHolder.bouncePreviousResult = undefined;

  }, timeout);

  return result;
}

/**
 * Генерирует мемоизированную (https://ru.wikipedia.org/wiki/Мемоизация) версию переданной функции для ограничения
 * частоты ее выполнения.
 */
export function debounced<T>(callback: (...args: any[]) => T, timeout: number): (...args: any[]) => T {
  const holder: { bounce: boolean; bouncePreviousResult?: T; } = { bounce: false };
  return (...args: any[]): T => {
    return debounce(() => callback(args), timeout, holder);
  };
}

/**
 * Создает экземпляр даты в указанный момент относительно UTC.
 */
export function createUTCDate(date?: Date) {
  if (!date) {
    date = new Date();
  }

  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ));
}

/**
 * Преобразует указанный экземпляр даты в дату относительно UTC.
 * Если дата не задана, используется текущие дата и время.
 */
export function convertDateToUTC(date?: Date) {
  if (!date) {
    date = new Date();
  }

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}

/**
 * Возвращает экземпляр текущей даты и времени в указанном часовом поясе, или преобразует указанные дату и время в
 * этот часовой пояс.
 */
export function getDateInTimezone(timezoneOffsetInMinutes: number, date?: Date) {
  const dt = convertDateToUTC(date);
  dt.setTime(dt.getTime() + timezoneOffsetInMinutes * 60 * 1000);

  return dt;
}

/**
 * Экранирует все необходимые символы для использования строки в составе регулярного выражения.
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

/**
 * Интерфейс произвольного объекта с любыми свойствами.
 */
export interface IArbitraryObject {
  [key: string]: any;
}
