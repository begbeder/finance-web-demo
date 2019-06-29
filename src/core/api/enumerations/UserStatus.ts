/**
 * Возможные статусы учетных записей пользователей.
 */
enum UserStatus {
  /**
   * Учетная запись только что зарегистрирована.
   */
  Registered = "registered",
  /**
   * Регистрация подтверждена.
   */
  Confirmed = "confirmed",
  /**
   * Учетная запись заблокирована.
   */
  Banned = "banned",
}

export default UserStatus;
