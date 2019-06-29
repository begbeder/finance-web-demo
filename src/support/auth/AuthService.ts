import Auth0Lock from "auth0-lock";
import decode from "jwt-decode";

import { AUTH_CONFIG } from "./auth0-config";

import EventEmitter from "eventemitter3";
import router from "../../router/router";
import { CredentialsStorage } from "../index";
import { Auth0Error } from "auth0-js";

/**
 * Класс-обертка для плагина авторизации auth0.
 */
export default class AuthService {
  public authenticated = this.isAuthenticated();
  public authNotifier = new EventEmitter();
  public admin = this.isAdmin();
  public userProfile!: any;
  public router = router;

  /**
   * Экземпляр плагина авторизации.
   * @type {Auth0LockStatic}
   */
  public lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, {
    autoclose: true,
    auth: {
      audience: AUTH_CONFIG.apiUrl,
      redirectUrl: AUTH_CONFIG.redirectURL,
      responseType: "id_token token",
      params: {
        scope: "openid profile email",
      },
    },
  });

  constructor() {
    this.lock.on("authenticated", this.setSession.bind(this));

    this.lock.on("authorization_error", error => console.log(error));

    this.login = this.login.bind(this);
    this.setSession = this.setSession.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
  }

  /**
   * Метод проверки авторизации.
   * Вызывает форму авторизации.
   */
  public login() {
    this.lock.show();
  }

  /**
   * Устанавливает данные сессиии пользователя.
   * @param {Auth0DecodedHash} authResult
   */
  public setSession(authResult: AuthResult) {
    // Устанавливает время, через которое истечет токен.
    const expiresAt = (authResult.expiresIn || 0) * 1000 + new Date().getTime();

    if (authResult.accessToken) {
      CredentialsStorage.set({
        access_token: authResult.accessToken || "",
        id_token: authResult.idToken || "",
        expires_at: expiresAt,
      });
    }

    this.authNotifier.emit("authChange", { authenticated: true, admin: this.isAdmin() });

    router.push("");
  }

  /**
   * Метод сброса сессии пользователя.
   */
  public logout() {
    CredentialsStorage.clear();

    this.userProfile = null;
    this.authNotifier.emit("authChange", false);

    // federal - параметр для сброса сессии у сторонних поставщиков.
    // Документация по методу - https://auth0.com/docs/logout
    const logoutUrl = `https://${AUTH_CONFIG.domain}/v2/logout?returnTo=${AUTH_CONFIG.redirectURL}`;

    window.location.replace(logoutUrl);
  }

  /**
   * Проверяет истекло ли время действия токена.
   * @return {boolean}
   */
  public isAuthenticated() {
    const credentials = CredentialsStorage.get();

    return new Date().getTime() < (credentials ? credentials.expires_at : 0);
  }

  /**
   * Метод получения токен доступа.
   * @return {string}
   */
  public getAccessToken() {
    const credentials = CredentialsStorage.get();

    return credentials ? credentials.access_token : null;
  }

  /**
   * Метод получения профиля пользователя.
   * @param cb
   */
  public getProfile(cb: any) {
    const accessToken = this.getAccessToken();

    if (accessToken) {
      this.lock.getUserInfo(accessToken, (err, profile) => {
        if (profile) {
          this.userProfile = profile;
        }

        cb(err, profile);
      });
    }
  }


  /**
   * Возвращает список ролей пользователя.
   * @return {string[] | null}
   */
  public getRoles(): string[] | null {
    const namespace = AUTH_CONFIG.namespace;

    const credentials = CredentialsStorage.get();

    if (!credentials || (credentials && credentials.access_token === "")) {
      return null;
    }

    return (decode(credentials.access_token) as any)[namespace] || null as any;
  }

  /**
   * Возвращает иистину если пользователь является администратором.
   * @return {boolean}
   */
  public isAdmin () {
    const roles = this.getRoles() as string[] | null;

    return roles ? roles.includes("administrator") : false;
  }

  /**
   * Метод получения нового токена.
   * @param {() => void} success
   * @param {(err: Auth0Error) => void} fail
   */
  public checkSession (success: () => void, fail: (err: Auth0Error) => void) {
    this.lock.checkSession({}, (error, authResult) => {
      if (error) {
        return fail(error);
      }

      if (authResult) {
        this.setSession(authResult);
        success();
      }
    });
  }
}
