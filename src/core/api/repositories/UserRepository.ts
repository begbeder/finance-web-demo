import { IUser } from "..";
import Repository from "./Repository";

/**
 * Класс-репозиторий для доступа к методам управления учетными записями пользователей в API.
 */
export default class UserRepository extends Repository {

  /**
   * Запрашивает информацию об учетной записе пользователя с указанным идентификатором.
   *
   * {@link https://docs.bellinigroup.ru/api/users#/Методы/getUserLoyaltySystemStatuses}
   */
  public get (id: number) {
    return this.axios
      .get(this.urlFactory.getUserUrl(id))
      .then(response => response.data as IUser);
  }

}

