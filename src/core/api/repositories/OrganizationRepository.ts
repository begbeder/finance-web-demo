import Repository from "./Repository";
import { IOrganization, ITable } from "../resources";

/**
 * Класс-репозиторий для доступа к методам работы с организациями в API.
 */
export default class OrganizationRepository extends Repository {

  /**
   * Возвращает список организаций c указанными параметрами
   */
  public async getList(parameters = {}) {
    return this.axios
               .get(this.urlFactory.getOrganizations(), { params: parameters })
               .then(response => response.data as IOrganization[]);
  }

  /**
   * Возвращает список доступных организаций для текущего пользователя.
   */
  public async getListMyOrganizations() {
    return this.axios
               .get(this.urlFactory.getMyOrganizations())
               .then(response => response.data as IOrganization[]);
  }

  /**
   * Делает запрос на создание новой организации.
   * @param {IOrganization} data
   */
  public async create(data: IOrganization) {
    return this.axios
               .post(this.urlFactory.getOrganizations(), data)
               .then(response => response.data as IOrganization);
  }

  /**
   * Делает запрос на изменение данных организации по идентификатору.
   * @param {number} id
   * @param {IOrganization} data
   */
  public async update(id: number, data: IOrganization) {
    return this.axios
               .put(this.urlFactory.getOrganizationUrl(id), data);
  }

  /**
   * Делает запрос на удаление организации.
   * @param {number} id
   */
  public async delete(id: number) {
    return this.axios
               .delete(this.urlFactory.getOrganizationUrl(id));
  }

  /**
   * Возвращает организацию по идентификатору.
   * @param {number} id
   */
  public async getItem(id: number) {
    return this.axios
               .get(this.urlFactory.getOrganizationUrl(id))
               .then(response => response.data as IOrganization);
  }

  /**
   * Возвращает список таблиц расходов по идентификатору организации.
   * @param {number} id
   * @return {Promise<ITable>}
   */
  public getTableList(id: number) {
    return this.axios
               .get(this.urlFactory.getOrganizationTableListUrl(id))
               .then(response => response.data as ITable[]);
  }
}
