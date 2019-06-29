import { RowTypes } from "../enumerations";
import { IRestaurant } from "./restaurants/IRestaurant";

export interface ICostItem {
  id: number;
  alias: string | null;
  type: string;
  title: string;
}

export interface ICell {
  id?: number;
  value: number;
  columnKey: string;
}

export interface IRow {
  id: number;
  alias?: any;
  title: string;
  costItem: ICostItem;
  type: RowTypes;
  children: IRow[];
  sort: number;
  cells: ICell[];
  plan: number;
}

export interface IHeaderItem {
  id: number;
  columnKey: string;
  title: string;
  dateFrom: Date;
  dateTo: Date;
}

export interface ITableObject {
  id: number;
  alias: string;
  dateFrom: Date;
  dateTo: Date;
  tableType: string;
  tableReportType: number;
  rows: IRow[];
  header: IHeaderItem[] | null;
  restaurant?: IRestaurant | null;
}
