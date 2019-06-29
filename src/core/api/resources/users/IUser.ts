import UserStatus from "../../enumerations/UserStatus";
import IResource from "../IResource";

/**
 * Интерфейс данных определения статуса в системе лояльности пользователей.
 */
export interface IUserLoyaltySystemStatus extends IResource {
  /**
   * Идентификатор статуса во внешней системе.
   */
  external_id: string | null;
  /**
   * Название статуса.
   */
  name: string;
  /**
   * Процент накопления начислений.
   */
  interest_rate: number;
}

/**
 * Интерфейс данных пользователя в системе лояльности.
 */
export interface IUserLoyaltyStatus {
  /**
   * Баланс начислений.
   */
  credits: number;
  /**
   * Информация о статусе в системе лояльности.
   */
  status: IUserLoyaltySystemStatus;
}

/**
 * Интерфейс данных учетной записи пользователя для массовой выборки.
 */
export interface IIndexUser extends IResource {
  /**
   * Идентификатор пользователя во внешней системе.
   */
  external_id: string | null;
  /**
   * Имя пользователя (логин). Для пользователей, зарегистрировавшихся через сайт, это, скорее всего, будет номер
   * телефона.
   */
  login: string;
  /**
   * Имя пользователя.
   */
  name: string | null;
  /**
   * Отчество пользователя.
   */
  patron: string | null;
  /**
   * Фамилия пользователя.
   */
  surname: string | null;
  /**
   * Дата рождения пользователя.
   * Указывается в формате "гггг-мм-дд чч:мм:сс".
   */
  birthday: string | null;
  /**
   * Номер телефона пользователя в формате "+[код страны] (111) 111-11-11".
   */
  phone: string | null;
  /**
   * Статус учетной записи пользователя.
   */
  status: UserStatus;
}

/**
 * Интерфейс данных учетной записи пользователя для выборки одного экземпляра.
 */
export interface IUser extends IIndexUser {
  type?: string;
}
