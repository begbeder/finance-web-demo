import Repository from "./Repository";
import { IRow } from "../resources";

/**
 * Класс-репозиторий для доступа к методам работы со строкой таблицы в API.
 */
export default class RowRepository extends Repository {

  /**
   * TODO Deprecated
   * Делает запрос на получение данных строки таблицы
   * @param {number} id
   * @return {IRow}
   */
  public async getRowById (id: number) {
    return this.axios
               .get(this.urlFactory.getRowItemUrl(id))
               .then(response => response.data as IRow);
  }

  /**
   * TODO Deprecated
   * Делает запрос на обновление данных строки таблицы
   * @param {number} id
   * @param {IRow} data
   * @return {Promise<AxiosPromise<any>>}
   */
  public async updateRowById (id: number, data: IRow) {
    return this.axios
               .put(this.urlFactory.getRowItemUrl(id), data);
  }

  /**
   * TODO Deprecated
   * Делает запрос на удаление данных строки таблицы
   * @param {number} id
   * @return {Promise<AxiosPromise>}
   */
  public async deleteRowById (id: number) {
    return this.axios
               .delete(this.urlFactory.getRowItemUrl(id));
  }

}
