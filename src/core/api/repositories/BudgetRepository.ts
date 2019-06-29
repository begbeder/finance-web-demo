import Repository from "./Repository";
import { IBudgetItem } from "../resources";

/**
 * Класс-репозиторий для доступа к методам работы со статьями бюджета в API.
 */
export default class BudgetRepository extends Repository {
  /**
   * Возвращает список статей c указанными параметрами
   */
  public getList (parameters = {}) {
    return this.axios
               .get(this.urlFactory.getBudgetItems(), { params: parameters })
               .then(response => response.data as IBudgetItem[]);
  }

  /**
   * Делает запрос на создание новой статьи
   * @param {IBudgetItem} data
   */
  public create (data: IBudgetItem) {
    return this.axios
               .post(this.urlFactory.getBudgetItems(), data)
               .then(response => response.data as IBudgetItem);
  }

  /**
   * Делает запрос на изменение данных статьи по идентификатору
   * @param {number} id
   * @param {IBudgetItem} data
   */
  public update (id: number, data: IBudgetItem) {
    return this.axios
               .put(this.urlFactory.getBudgetItemUrl(id), data);
  }

  /**
   * Делает запрос на удаление статьи.
   * @param {number} id
   */
  public delete (id: number) {
    return this.axios
               .delete(this.urlFactory.getBudgetItemUrl(id));
  }

  /**
   * Возвращает статью по идентификатору
   * @param {number} id
   */
  public getItem (id: number) {
    return this.axios
               .get(this.urlFactory.getBudgetItemUrl(id))
               .then(response => response.data as IBudgetItem);
  }


  public updateList (data: any) {
    return this.axios
      .put(this.urlFactory.getBudgetItemListUrl(), data);
  }
}
