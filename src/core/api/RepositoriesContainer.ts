import {
  AuthRepository,
  CellRepository,
  UserRepository,
  RowRepository,
  Repository,
  RestaurantRepository,
  OrganizationRepository,
  BudgetRepository,
  TableRepository,
} from "./repositories";
import { UrlFactory, AxiosFactory } from "./index";

/**
 * Интерфейс с перечислением полей хранимых экземпляров репозиториев.
 * Используется для типизации аргумента вспомогательной функции.
 */
interface  IRepositoriesContainer {
  authRepository?: AuthRepository;
  cellRepository?: CellRepository;
  rowRepository?: RowRepository;
  restaurantRepository?: RestaurantRepository;
  organizationRepository?: OrganizationRepository;
  budgetRepository?: BudgetRepository;
  tableRepository?: TableRepository;
  userRepository?: UserRepository;
}

/**
 * Класс-контейнер экземпляров репозиториев для доступа к API.
 */
export default class RepositoriesContainer {
  /**
   * Синглтон контейнера.
   */
  private static containerInstance: RepositoriesContainer;
  protected authRepository?: AuthRepository;
  protected tableRepository?: TableRepository;
  protected cellRepository?: CellRepository;
  protected rowRepository?: RowRepository;
  protected restaurantRepository?: RestaurantRepository;
  protected organizationRepository?: OrganizationRepository;
  protected budgetRepository?: BudgetRepository;
  protected userRepository?: UserRepository;

  /**
   * Конструктор.
   * В качестве параметров можно передать особые реализации фабрик URL, Axios и методов.
   */
  public constructor(private urlFactoryInstance?: UrlFactory,
                     private axiosFactoryInstance?: AxiosFactory) {

  }

  /**
   * Возвращает синглтон контейнера.
   */
  public static get instance(): RepositoriesContainer {
    if (RepositoriesContainer.containerInstance === undefined) {
      RepositoriesContainer.containerInstance = new RepositoriesContainer();
    }

    return RepositoriesContainer.containerInstance;
  }

  /**
   * Задает синглтон контейнера.
   * Данный метод может быть использован для замены реализации данного контейнера, используемой по умолчанию.
   */
  public static set instance(instance: RepositoriesContainer) {
    RepositoriesContainer.containerInstance = instance;
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
  }

  // Группа геттеров свойств для удобства получения доступа к экземплярам репозиториев
  /**
   * Возвращает экземпляр репозитория для доступа к методам работы с таблицей.
   */
  public get tables(): TableRepository {
    return this.get("tableRepository", TableRepository);
  }

  /**
   * Возвращает экземпляр репозитория доступа к методам работы с ячейками таблицы.
   */
  public get cells(): CellRepository {
    return this.get("cellRepository", CellRepository);
  }

  /**
   * Возвращает экземпляр репозитория доступа к методам работы с ячейками таблицы.
   */
  public get rows(): RowRepository {
    return this.get("rowRepository", RowRepository);
  }

  /**
   * Возвращает экземпляр репозитория доступа к методам работы с ресторанами.
   */
  public get restaurants(): RestaurantRepository {
    return this.get("restaurantRepository", RestaurantRepository);
  }

  /**
   * Возвращает экземпляр репозитория доступа к методам работы с организациями.
   */
  public get organizations(): OrganizationRepository {
    return this.get("organizationRepository", OrganizationRepository);
  }

  /**
   * Возвращает экземпляр репозитория доступа к методам работы со статьями бюджета.
   */
  public get budgetItem(): BudgetRepository {
    return this.get("budgetRepository", BudgetRepository);
  }

  /**
   * Возвращает экземпляр репозитория доступа к методам работы с данными пользователя.
   */
  public get users(): UserRepository {
    return this.get("userRepository", UserRepository);
  }

  /**
   * Возвращает экземпляр репозитория доступа к методам работы с авторизацией и регистрацией.
   */
  public get auth(): AuthRepository {
    return this.get("authRepository", AuthRepository);
  }

  /**
   * Возвращает ранее созданный или создает новый экземпляр репозитория указанного типа.
   */
  protected get<R extends Repository>(fieldName: keyof IRepositoriesContainer, constructor: {
    new(urlFactoryInstance?: UrlFactory,
        axiosFactoryInstance?: AxiosFactory): R,
  }): R {
    const existing = this[fieldName];
    if (typeof existing === "undefined") {
      return (this[fieldName] as any) = new constructor(this.urlFactoryInstance, this.axiosFactoryInstance);
    }

    return existing as any;
  }
}
