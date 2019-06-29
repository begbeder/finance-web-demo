/**
 * Интерфейс данных для аутентификации пользователя по логину и паролю.
 */
export interface IUserAuthenticationByLoginAndPassword {
  /**
   * Логин.
   */
  login: string;
  /**
   * Пароль.
   */
  password: string;
}

/**
 * Интерфейс данных для аутентификации пользователя по логину и временному коду.
 */
export interface IUserAuthenticationByLoginAndTemporaryToken {
  /**
   * Логин.
   */
  login: string;
  /**
   * Временный код.
   */
  token: string;
}

/**
 * Интерфейс данных для аутентификации пользователя по номеру телефона и временному коду.
 */
export interface IUserAuthenticationByPhoneAndTemporaryToken {
  /**
   * Номер телефона.
   */
  phone: string;
  /**
   * Временный код.
   */
  token: string;
}

/**
 * Объединение типов данных для аутентификации.
 */
export type IUserAuthentication =
  IUserAuthenticationByLoginAndPassword
  | IUserAuthenticationByLoginAndTemporaryToken
  | IUserAuthenticationByPhoneAndTemporaryToken;
