import { ITable, IRestaurant } from "../..";

export interface IRestaurantCost {
  id: number;
  title: string | null;
  path: string;
}

export interface IRestaurantReport {
  id: number;
  title: string | null;
  path: string;
}

export interface IRestaurantMenuItem {
  id: number;
  title: string | null;
  path: string;
  costs: IRestaurantCost[] | null;
  reports: IRestaurantReport[] | null;
}

export interface ISite {
  restaurantMenu: IRestaurantMenuItem[] | null;
  tables: ITable[] | null;
  restaurants: IRestaurant[] | null;
}
