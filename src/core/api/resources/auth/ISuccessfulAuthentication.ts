/**
 * Интерфейс данных, возвращаемых при успешной аутентификации пользователя.
 */
export default interface ISuccessfulAuthentication {

  /**
   * Идентификатор аутентифицированного пользователя.
   */
  user_id: number;
  /**
   * Первичный ключ, используемый для авторизации при вызовах API.
   */
  token: string;
  /**
   * Вторичный ключ, используемый для обновления первичного.
   */
  refresh_token: string;
  /**
   * Время в секундах до истечения срока действия первичного ключа.
   */
  expires_in: number;

}
