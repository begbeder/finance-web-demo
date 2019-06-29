import PermanentStorage from "store";

/**
 * Интерфейс данных профиля пользователя.
 */
export interface ICredentials {
  access_token: string;
  id_token: string;
  expires_at: number;
}

/**
 * Класс модуля для сохранения профиля пользователя.
 */
  // tslint:disable:variable-name
export class Credentials {
  public access_token!: string;
  public id_token!: string;
  public expires_at!: number;

  constructor(data: ICredentials) {
    this.access_token = data.access_token;
    this.id_token = data.id_token;
    this.expires_at = data.expires_at;
  }

  /**
   * Преобразует данные в строковое представление.
   */
  public toString() {
    return JSON.stringify({
      access_token: this.access_token,
      id_token: this.id_token,
      expires_at: this.expires_at,
    });
  }
}
// tslint:enable:variable-name

/**
 * Ключ для сохранения постоянных аутентификационных данных пользователя.
 */
const STORAGE_KEY = "userCredentials";

/**
 * Набор методов, предназначенных для работы с хранилищем аутентификационных данных пользователя.
 */
const CredentialsStorage = {

  /**
   * Возвращает экземпляр класса-модели аутентификационных данных пользователя, если они были сохранены ранее.
   */
  get(): Credentials | null {
    const serializedCredentials = PermanentStorage.get(STORAGE_KEY);
    if (serializedCredentials) {
      return new Credentials(serializedCredentials);
    }

    return null;
  },

  /**
   * Сохраняет аутентификационные данных пользователя.
   */
  set(credentials: ICredentials) {
    CredentialsStorage.clear();

    // Из-за того, что пепедается простой объект, создается экземпляр класса.
    (PermanentStorage as any).storage.write(STORAGE_KEY, (new Credentials(credentials)).toString());
  },

  /**
   * Сбрасывает ранее сохраненные аутентификационные данные.
   */
  clear() {
    PermanentStorage.remove(STORAGE_KEY);
  },

};
export default CredentialsStorage;
