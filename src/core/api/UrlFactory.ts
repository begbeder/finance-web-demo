import { ApiUrl } from "./enumerations";

/**
 * Фабрика-синглтон для генерации URL для доступа к API бизнес-процессов.
 * Каждый метод возвращает URL для доступа к сущностям с указанными идентификаторами.
 * Если не задать во время исполнения префикс URL (UrlFactory.instance.setPrefix), то все ссылки будут возвращаться
 * относительными.
 */
export default class UrlFactory {

  /**
   * Синглтон фабрики.
   */
  private static factoryInstance: UrlFactory;

  /**
   * Префикс (читай: домен) всех генерируемых URL.
   */
  private prefix: string = "";

  /**
   * Создает экземпляр фабрики с указанным префиксом URL.
   */
  public constructor(prefix: string = "") {
    this.setPrefix(prefix);
  }

  /**
   * Возвращает синглтон фабрики.
   */
  public static get instance(): UrlFactory {
    if (UrlFactory.factoryInstance === undefined) {
      UrlFactory.factoryInstance = new UrlFactory();
    }

    return UrlFactory.factoryInstance;
  }

  /**
   * Задает синглтон фабрики.
   * Данный метод может быть использован для замены реализации данной фабрики, используемой по умолчанию.
   */
  public static set instance(instance: UrlFactory) {
    UrlFactory.factoryInstance = instance;
  }

  /**
   * Задает префикс всех генерируемых URL.
   */
  public setPrefix(prefix: string): void {
    if (prefix.endsWith("/")) {
      prefix = prefix.substr(0, prefix.length - 1);
    }

    this.prefix = prefix;
  }

  /**
   * Возвращает префикс всех генерируемых URL.
   */
  public getPrefix(): string {
    return this.prefix;
  }

  /**
   * Заменяет в указанном URL все параметры на переданные, подставляет ранее заданный префикс и возвращает результат.
   */
  public getUrl(url: ApiUrl, parameters?: { [key: string]: number }): string {
    let result: string = this.prefix + url;

    if (parameters) {
      for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          result = result.replace("{" + key + "}", parameters[key].toString());
        }
      }
    }

    return result;
  }

  /**
   * Возвращает URL для получения списка таблиц.
   */
  public getTableUrl(): string {
    return this.getUrl(ApiUrl.TableList);
  }

  /**
   * Возвращает URL для создания пустой таблицы расходов.
   */
  public getTableCreateUrl(): string {
    return this.getUrl(ApiUrl.TableCreate);
  }

  /**
   * Возвращает URL для получения таблицы по идентификатору.
   */
  public getTableItemUrl(id: number): string {
    return this.getUrl(ApiUrl.TableItem, { id });
  }

  /**
   * Возвращает URL для получения таблицы по идентификатору.
   */
  public getTableItem(): string {
    return this.getUrl(ApiUrl.TableItem);
  }

  /**
   * Возвращает URL для получения строки таблицы по идентификатору
   */
  public getRowItemUrl(id: number): string {
    return this.getUrl(ApiUrl.RowItem, { id });
  }

  /**
   * Возвращает URL для получения ячейки таблицы с указанным идентификатором.
   */
  public getFactItemUrl(id: number): string {
    return this.getUrl(ApiUrl.FactUpdate, { id });
  }

  /**
   * Возвращает URL для получения ячейки плана таблицы.
   */
  public getPlanUrl(): string {
    return this.getUrl(ApiUrl.PlanUpdate);
  }

  /**
   * Возвращает URL для получения списка таблиц.
   */
  public getUserUrl(id: number) {
    return this.getUrl(ApiUrl.UserItem, { id });
  }

  /**
   * Возвращает URL для регистрации учетной записи пользователя.
   */
  public getRegistrationUrl(): string {
    return this.getUrl(ApiUrl.Register);
  }

  /**
   * Возвращает URL для аутентификации пользователя.
   */
  public getLoginUrl(): string {
    return this.getUrl(ApiUrl.Login);
  }

  /**
   * Возвращает URL для запроса временного кода для аутентификации пользователя.
   */
  public getTemporaryTokenRequestUrl(): string {
    return this.getUrl(ApiUrl.RequestTemporaryToken);
  }

  /**
   * Возвращает URL для ауентификации пользователя по временному коду.
   */
  public getLoginWithTemporaryTokenUrl(): string {
    return this.getUrl(ApiUrl.LoginWithTemporaryToken);
  }

  /**
   * Возвращает URL для обновления аутентификационного токена.
   */
  public getTokenRefreshUrl(): string {
    return this.getUrl(ApiUrl.RefreshToken);
  }

  /**
   * Возвращает URL для закрытия сессии пользователя.
   */
  public getLogoutUrl(): string {
    return this.getUrl(ApiUrl.Logout);
  }

  /**
   * Возвращает URL для получения списка ресторанов
   */
  public getRestaurantUrl(): string {
    return this.getUrl(ApiUrl.RestaurantList);
  }

  /**
   * Возвращает URL для получения ресторана по идентификатору.
   */
  public getRestaurantItemUrl(id: number): string {
    return this.getUrl(ApiUrl.RestaurantList);
  }

  /**
   * Возвращает URL для получения списка организаций или добавления новой.
   */
  public getOrganizations(): string {
    return this.getUrl(ApiUrl.Organizations);
  }

  /**
   * Возвращает URL для получения списка доступных организаций для текущего пользователя.
   */
  public getMyOrganizations(): string {
    return this.getUrl(ApiUrl.OrganizationsMyList);
  }

  /**
   * Возвращает URL для получения организации по идентификатору.
   */
  public getOrganizationUrl(id: number): string {
    return this.getUrl(ApiUrl.OrganizationUrl, { id });
  }

  /**
   * Возвращает URL для получения организации по идентификатору.
   */
  public getOrganizationTableListUrl(id: number): string {
    return this.getUrl(ApiUrl.OrganizationTableList, { id });
  }

  /**
   * Возвращает URL для получения списка статей.
   */
  public getBudgetItems (): string {
    return this.getUrl(ApiUrl.BudgetItems);
  }

  /**
   * Возвращает URL для получения статьи по идентификатору.
   * @param {number} id
   */
  public getBudgetItemUrl(id: number): string {
    return this.getUrl(ApiUrl.BudgetItemUrl, { id });
  }

  /**
   * Возвращает URL для обновления списка статей.
   * @param {number} id
   */
  public getBudgetItemListUrl(): string {
    return this.getUrl(ApiUrl.BudgetItemListUrl);
  }

  /**
   * Возвращает URL для получения списка планов.
   */
  public getPlanListUrl(): string {
    return this.getUrl(ApiUrl.PlanList);
  }

  /**
   * Возвращает URL для обновления статьи.
   */
  public getPlanItemUrl(id: number): string {
    return this.getUrl(ApiUrl.PlanItemUrl, { id });
  }

}
