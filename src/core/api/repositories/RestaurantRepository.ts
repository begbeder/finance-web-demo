import Repository from "./Repository";
import { IRestaurant } from "../resources";

/**
 * Класс-репозиторий для доступа к методам работы с ресторанами в API.
 */
export default class RestaurantRepository extends Repository {

  /**
   * TODO Deprecated
   * Делает запрос на получение списка ресторанов
   * /api/Restaraunts
   */
  public getList () {
    return this.axios
      .get(this.urlFactory.getRestaurantUrl())
      .then(response => response.data as IRestaurant[]);
  }

  /**
   * TODO Deprecated
   * Делает запрос на добавление ресторана
   * /api/Restaraunts
   */
  public createRestaurant (restaurant: IRestaurant) {
    return this.axios
               .post(this.urlFactory.getRestaurantUrl(), restaurant);
  }

  /**
   * TODO Deprecated
   * Делает запрос на получение ресторана по идентификатору
   * /api/Restoraunt
   */
  public getRestaurantById (id: number) {
    return this.axios
               .get(this.urlFactory.getRestaurantItemUrl(id))
               .then(response => response.data as IRestaurant);
  }

  /**
   * TODO Deprecated
   * Делает запрос на изменение ресторана по идентификатору
   * /api/Restoraunt
   */
  public updateRestaurantById (id: number, restaurant: IRestaurant) {
    return this.axios
               .put(this.urlFactory.getRestaurantItemUrl(id), restaurant);
  }

  /**
   * TODO Deprecated
   * Делает запрос на удаление ресторана по идентификатору
   * /api/Restoraunt
   */
  public deleteRestaurantById (id: number) {
    return this.axios
               .delete(this.urlFactory.getRestaurantItemUrl(id));
  }

}
