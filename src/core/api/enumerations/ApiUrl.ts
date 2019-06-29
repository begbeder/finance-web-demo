/**
 * Перечисление всех возможных URL для доступа к API.
 */
enum ApiUrl {
  /**
   * Получение списка таблиц.
   */
  TableList               = "/api/Tables",

  /**
   * Создание таблицы с пустыми данными.
   */
  TableCreate             = "/api/Tables/CreateTestData",

  /**
   * Получение таблицы по идентификатору.
   */
  TableItem               = "/api/Tables/GetEditableDaily",

  /**
   * Получение списка строк.
   * @type {string}
   */
  RowList                 = "/api/Rows",

  /**
   * Получение строки по идентификатору.
   * @type {string}
   */
  RowItem                 = "/api/Rows/{id}",

  /**
   * Получение списка ячеек таблицы.
   */
  CellList                = "/api/Cells",

  /**
   * Создание ячейки таблицы.
   */
  CellCreate              = "/api/Cells",

  /**
   * Получение, обновление, удаление ячейки таблицы по идентификатору.
   */
  CallItem                = "/api/Cells/{id}",

  /**
   * Обновление значения ячейки.
   */
  FactUpdate              = "/api/Tables/FactUpdate/{id}",

  /**
   * Обновление значения ячейки плана статьи.
   */
  PlanUpdate              = "/api/Plans/PlanUpdate",

  /**
   * Получение данных пользователя по идентификатору
   * @type {string}
   */
  UserItem                = "/users/{id}",

  /**
   * Регистрация пользователя.
   */
  Register                = "/register",

  /**
   * Аутентификация пользователя.
   */
  Login                   = "/login",

  /**
   * Запрос временного кода для аутентификации пользователя.
   */
  RequestTemporaryToken   = "/login/request_token",

  /**
   * Аутентификация через временный код.
   */
  LoginWithTemporaryToken = "/login/with_token",

  /**
   * Обновление аутентификационного токена.
   */
  RefreshToken            = "/refresh_token",

  /**
   * Закрытие сессии пользователя.
   */
  Logout                  = "/logout",

  /**
   * Получение списка ресторанов.
   */
  RestaurantList          = "/api/Restaurants",

  /**
   * Получение, обновление, удаление ресторана по идентификатору.
   */
  RestaurantItem          = "/api/Restaurants/{id}",

  /**
   * Получение списка организаций
   */
  Organizations           = "/api/Organizations",

  /**
   * Получение, обновление, удаление организации по идентификатору
   */
  OrganizationUrl         = "/api/Organizations/{id}",

  /**
   * Получение доступных для просмотра организаций.
   */
  OrganizationsMyList = "/api/Organizations/My",

  /**
   * Получение списка таблиц по идентификатору организации.
   */
  OrganizationTableList = "/api/Organizations/{id}/Tables",

  /**
   * Получение списка статей
   */
  BudgetItems             = "/api/BudgetItems",

  /**
   * Получение, обновление, удаление статей.
   */
  BudgetItemUrl           = "/api/BudgetItems/{id}",

  /**
   * Сохраняет изменения для списка статей
   */
  BudgetItemListUrl       = "/api/BudgetItems/List",

  /**
   * Получение списка планов.
   */
  PlanList = "/api/Plans",

  /**
   * Получение, обновление, удаление статьи плана
   */
  PlanItemUrl = "/api/Plans/{id}",
}

export default ApiUrl;
