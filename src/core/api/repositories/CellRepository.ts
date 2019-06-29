import Repository from "./Repository";
import { ICell, IPlan } from "../resources";

/**
 * Класс-репозиторий для доступа к методам работы с таблицей в API.
 */
export default class CellRepository extends Repository {

  /**
   * Делает запрос на обновление значения ячейки таблицы, результатом являются обновленные ячейки.
   * @param {number} id
   * @param {number} data
   * @return {Promise<ICell[]>}
   */
  public factUpdate (id: number, data: number) {
    return this.axios
      .put(this.urlFactory.getFactItemUrl(id), data)
      .then(response => response.data as ICell[]);
  }

  /**
   * Делает запрос на обновление значения ячейки плана, результатом являются обновленные ячейки.
   * @param { planId: number, fillMonth: boolean, value: number } data
   * @return {Promise<ICell[]>}
   */
  // public planUpdate (id: number, data: number) {
  public planUpdate (data: { planId: number, fillMonth: boolean, value: number }) {
    return this.axios
               .put(this.urlFactory.getPlanUrl(), data)
               .then(response => response.data as ICell[]);
  }

  /**
   * Делает запрос на создание плана статьи.
   * @param {IPlan} data
   * @return {AxiosPromise<IPlan>}
   */
  public createPlan (data: IPlan) {
    return this.axios
               .post(this.urlFactory.getPlanListUrl(), data);
  }

  /**
   * Делает запрос на удаление плана статьи.
   * @param {number} id
   */
  public deletePlan (id: number) {
    return this.axios
      .delete(this.urlFactory.getPlanItemUrl(id));
  }
}
