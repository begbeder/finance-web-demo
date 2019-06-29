import IResource from "../IResource";
import { RowTypes, TableType, ColumnPeriodTypes } from "../../enumerations";
import { IOrganization, IBudgetItem } from "../index";

/**
 * Интерфейс плоского списка объектов ячеек
 */
export interface IFlatList {
  [key: string]: ICell;
}

/**
 * Интерфейс ячейки шапки таблицы
 */
export interface  IColumn {
  title: string;
  dateFrom: Date;
  dateTo: Date;
  columnType: RowTypes;
  columnPeriod: ColumnPeriodTypes;
  color: string;
}

/**
 * Интерфейс ячейки значений таблицы
 */
export interface ICell {
  factId: number;
  planId: number;
  key: string;
  value: number;
  dateFrom: Date;
  dateTo: Date;
  cellType: RowTypes;
  color: string;
}

/**
 * Интерфейс плана статьи расхода
 */
export interface IPlan {
  organizationId: number;
  organization?: IOrganization;
  budgetItemId: number;
  budgetItem?: IBudgetItem;
  value: number;
  dateTime: Date;
}

export interface IRow {
  title: string;
  planValue: number;
  planId: number;
  cells: ICell[];
  color: string;
  rowType: RowTypes;
  children: IRow[];
  budgetItemId: number;
}

export interface ITableColor {
  colorColumnsBase: string;
  colorColumnsPlan: string;
  colorColumnsTotal: string;
  colorRowBase: string;
}

export interface ITableQuery {
  organization: IOrganization;
  dateFrom: Date;
  dateTo: Date;
  groupingByName: ColumnPeriodTypes;
  columnPlan: boolean;
  columnTotalForBungetItem: boolean;
  rowTotal: number;
  tableColor: ITableColor;
}

/**
 * Интерфейс данных таблицы расходов
 */
export interface ITable extends IResource {
  tableQuery: ITableQuery;
  columns: IColumn[];
  rows: IRow[];
}

/**
 * Интерфейс параметров для получения таблицы
 * Используется для запроса таблицы из апи
 */
export interface ITableParams {
  organizationId?: number;
  dateTime?: Date | string;
}
