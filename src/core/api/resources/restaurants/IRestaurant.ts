import IResource from "../IResource";

/**
 * Интерфейс данных ресторане.
 */
export interface IRestaurant extends IResource {
  id: number;
  title: string;
  isActive: boolean;
}
