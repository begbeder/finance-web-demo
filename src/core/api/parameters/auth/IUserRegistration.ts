import { NotificationChannel } from "../..";

/**
 * Базовый интерфейс данных для регистрации учетной записи пользователя.
 */
export interface IUserInfo {
  /**
   * Имя пользователя.
   */
  name?: string;
  /**
   * Отчество пользователя.
   */
  patron?: string;
  /**
   * Фамилия пользователя.
   */
  surname?: string;
  /**
   * Адрес эл. почты пользователя.
   */
  email?: string;
}

/**
 * Интерфейс данных для регистрации учетной записи пользователя по номеру телефона.
 */
export interface IUserRegistrationByPhone extends IUserInfo {
  /**
   * Номер телефона в международном формате.
   */
  phone: string;
  /**
   * Способ доставки временного кода для последующей аутентификации.
   */
  method?: NotificationChannel;
}

/**
 * Интерфейс данных для регистрации учетной записи пользователя по логину и паролю.
 */
export interface IUserRegistrationByUsername extends IUserInfo {
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
 * Объединение интерфейсов данных для регистрации пользователя.
 */
export type IUserRegistration = IUserRegistrationByPhone | IUserRegistrationByUsername;
