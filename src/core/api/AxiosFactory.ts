import axios, { AxiosInstance } from "axios";
import qs from "qs";
import { CredentialsStorage, AuthService } from "../../support";

/**
 * Фабрика-синглтон библиотеки axios.
 * Используется для создания экземпляра axios с настройками, необходимыми для работы с API бизнес-процессов.
 */
export default class AxiosFactory {
  /**
   * Синглтон фабрики.
   */
  private static factoryInstance: AxiosFactory;

  /**
   * Возвращает синглтон фабрики.
   */
  public static get instance(): AxiosFactory {
    if (AxiosFactory.factoryInstance === undefined) {
      AxiosFactory.factoryInstance = new AxiosFactory();
    }

    return AxiosFactory.factoryInstance;
  }

  /**
   * Задает синглтон фабрики.
   * Данный метод может быть использован для замены реализации данной фабрики, используемой по умолчанию.
   */
  public static set instance(instance: AxiosFactory) {
    AxiosFactory.factoryInstance = instance;
  }

  /**
   * Создает экземпляр axios с настройками, необходимыми для работы с API бизнес-процессов.
   */
  public create(): AxiosInstance {
    const localAxios = axios.create({
      headers: { "Content-Type": "application/json" },
      paramsSerializer: (params: any): string => {
        return qs.stringify(params,
          {
            arrayFormat: "brackets",
            indices: false,
            strictNullHandling: true,
            encode: true,
            encoder: (value: any, defaultEncoder?: (val: string) => string) => {
              if (typeof value === "boolean" || value instanceof Boolean) {
                return Number(value);

              } else if (defaultEncoder) {
                return defaultEncoder(value);
              }
            },
          });
      },
    });

    // Перехватчик запроса для подстановки токена.
    localAxios.interceptors.request.use(
      config => {
        if (!config.headers.Autorization) {
          const credentrials = CredentialsStorage.get();
          if (credentrials) {
            config.headers.Authorization = `Bearer ${credentrials.access_token}`;
          }
        }

        return config;
      },
      (error: Error) => Promise.reject(error),
    );

    localAxios.interceptors.response.use(response => {
      return response;
    }, (error) => {
      const originalRequest = error.config;

      if ((error.response.status === 401)) {
        const auth = new AuthService();

        return new Promise((resolve, reject) => {
          auth.checkSession(() => {
            resolve();
          }, (failMessage) => {
            reject(failMessage);
          });
        }).then(() => {
          originalRequest.headers.Authorization = `Bearer ${auth.getAccessToken()}`;

          return localAxios.request(originalRequest);
        }).catch((errorCheckSession) => {
          // Если не удалось обновить сессию, то показываем пользователю страницу авторизации.
          auth.router.push("");
          auth.login();

          return Promise.reject(errorCheckSession);
        });
      } else {
        return Promise.reject(error);
      }
    });


    return localAxios;
  }

}
