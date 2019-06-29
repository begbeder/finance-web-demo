import { AxiosInstance, AxiosRequestConfig } from "axios";

import { AxiosFactory, UrlFactory } from "..";

/**
 * Класс, предоставляющий базовый функционал для всех репозиториев ресурсов из API.
 */
export default abstract class Repository {
  /**
   * Экземпляр axios, разделяемый между разными репозиториями ради экономии памяти.
   */
  protected static sharedAxios: AxiosInstance;

  /**
   * Экземпляр axios, специфичный для конкретной реализации репозитория.
   */
  protected localAxios?: AxiosInstance;

  /**
   * Конструктор.
   * В качестве параметров можно передать особые реализации фабрик URL, Axios и методов.
   */
  public constructor(private urlFactoryInstance?: UrlFactory,
                     private axiosFactoryInstance?: AxiosFactory) {
  }

  /**
   * Возвращает экземпляр фабрики URL доступа к API.
   */
  public get urlFactory(): UrlFactory {
    return this.urlFactoryInstance || UrlFactory.instance;
  }

  /**
   * Задает экземпляр фабрики URL доступа к API.
   */
  public set urlFactory(factory: UrlFactory) {
    this.urlFactoryInstance = factory;
  }

  /**
   * Возвращает экземпляр фабрики для создания клиента HTTP-запросов.
   */
  public get axiosFactory(): AxiosFactory {
    return this.axiosFactoryInstance || AxiosFactory.instance;
  }

  /**
   * Задает экземпляр фабрики для создания клиента HTTP-запросов.
   */
  public set axiosFactory(factory: AxiosFactory) {
    this.axiosFactoryInstance = factory;

    // Сбросим ранее созданный экземпляр клиента, чтобы создать его с помощью новой фабрики
    this.localAxios = undefined;
  }

  /**
   * Возвращает экземпляр axios для осуществления запросов к API.
   * Если в конструктор класса был передан экземпляр фабрики AxiosFactory, то экземпляр будет создан с ее помощью. В
   * ином случае будет использован глобальный экземляр фабрики для создания экземпляра axios, который также будет
   * разделяться со всеми остальными реализациями репозиториев.
   */
  public get axios(): AxiosInstance {
    if (this.localAxios) {
      return this.localAxios;

    } else if (this.axiosFactoryInstance) {
      return this.localAxios = this.axiosFactoryInstance.create();
    }

    if (!Repository.sharedAxios) {
      Repository.sharedAxios = AxiosFactory.instance.create();
    }

    return Repository.sharedAxios;
  }

  /**
   * Метод-помощник для подстановки данных для формирования запроса к API.
   */
  public request<P extends object>(params?: P, authToken?: string): AxiosRequestConfig {
    return { params, ...this.auth(authToken) };
  }

  /**
   * Метод-помощник для подстановки нужных заголовков для аутентификации запросов к API.
   */
  public auth(token?: string): { headers?: { [header: string]: string } } {
    if (token) {
      return { headers: { Authorization: `Bearer ${token}` } };
    } else {
      return {};
    }
  }

}
