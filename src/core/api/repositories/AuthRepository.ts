import { ISuccessfulAuthentication, IUserAuthentication, IUserRegistration, NotificationChannel } from "..";
import Repository from "./Repository";

/**
 * Класс-репозиторий для доступа к методам регистрации и аутентификации учетных записей в API.
 */
export default class AuthRepository extends Repository {

  /**
   * Делает запрос на аутентификацию пользователя по логину и паролю.
   *
   * {@link https://docs.bellinigroup.ru/api/system#/Методы/login}
   * {@link https://docs.bellinigroup.ru/api/system#/Методы/loginByTemporaryToken}
   */
  public async login(data: IUserAuthentication): Promise<ISuccessfulAuthentication> {
    if (!(data as any).token) {
      return this.axios
                 .post(this.urlFactory.getLoginUrl(), data)
                 .then(response => response.data) as Promise<ISuccessfulAuthentication>;

    } else {
      return this.axios
                 .post(this.urlFactory.getLoginWithTemporaryTokenUrl(), data)
                 .then(response => response.data) as Promise<ISuccessfulAuthentication>;
    }
  }

  /**
   * Делает запрос на регистрацию учетной записи пользователя.
   *
   * {@link https://docs.bellinigroup.ru/api/system#/Методы/registerUser}
   */
  public async register(data: IUserRegistration): Promise<void> {
    return this.axios.post(this.urlFactory.getRegistrationUrl(), data) as Promise<any>;
  }

  /**
   * Делает запрос на получение временного кода для аутентификации по номеру телефона.
   *
   * {@link https://docs.bellinigroup.ru/api/system#/Методы/requestTemporaryToken}
   */
  public async requestTemporaryToken(phone: string,
                                     method: NotificationChannel = NotificationChannel.Sms): Promise<void> {
    return this.axios.post(this.urlFactory.getTemporaryTokenRequestUrl(), { phone, method }) as Promise<any>;
  }

  /**
   * Делает запрос на завершение сессии с указанным первичным токеном.
   *
   * {@link https://docs.bellinigroup.ru/api/system#/Методы/logout}
   */
  public async logout(token: string): Promise<void> {
    return this.axios.post(this.urlFactory.getLogoutUrl(), null,
      { headers: { Authorization: `Bearer ${token}` } }) as Promise<any>;
  }

  /**
   * Делает запрос на обновление первичного токена по указанному вторичному.
   *
   * {@link https://docs.bellinigroup.ru/api/system#/Методы/refreshId}
   */
  public async refreshToken(userRefreshToken: string): Promise<ISuccessfulAuthentication> {
    return this.axios
               .post(this.urlFactory.getTokenRefreshUrl(), JSON.stringify(userRefreshToken))
               .then(response => response.data) as Promise<ISuccessfulAuthentication>;
  }

}

