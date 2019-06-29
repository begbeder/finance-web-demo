import Repository from "./Repository";
import { ITable, ITableParams } from "../resources";

/**
 * Класс-репозиторий для доступа к методам работы с таблицей в API.
 */
export default class TableRepository extends Repository {
  /**
   * TODO Deprecated
   * Делает запрос на получение списка таблиц расходов
   * /api/Tables
   */
  public getList () {
    return this.axios
               .get(this.urlFactory.getTableUrl())
               .then(response => response.data as ITable[]);
  }

  /**
   * Делает запрос на создание новой таблицы расходов.
   * /api/Tables
   */
  public async createTable (tableData: { dateTime: string, organizationId: number }) {
    return this.axios
               .post(this.urlFactory.getTableCreateUrl(), tableData);
  }

  /**
   * TODO Deprecated
   * Делает запрос на получение объекта таблицы по идентификатору
   * /api/Tables/{id}
   */
  public async getTableById (id: number) {
    return this.axios
               .get(this.urlFactory.getTableItemUrl(id))
               .then(response => response.data as ITable);
  }

  /**
   * TODO Deprecated
   * Делает запрос на изменение объекта таблицы по идентификатору
   * /api/Tables/{id}
   */
  public async updateTableById (id: number, data: ITable) {
    return this.axios
               .put(this.urlFactory.getTableItemUrl(id), data);
  }

  /**
   * TODO Deprecated
   * Делает запрос на удаление таблицы по идентификатору
   * /api/Tables/{id}
   */
  public async deleteTableById (id: number) {
    return this.axios
               .put(this.urlFactory.getTableItemUrl(id));
  }

  /**
   * Возвращает полную таблицу с данными для редактирования расходов
   */
  public async getTableItem (parameters: ITableParams) {
    return this.axios
               .get(this.urlFactory.getTableItem(), { params: parameters})
               .then(response => response.data as ITable);
  }
}
