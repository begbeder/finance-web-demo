import { IRow, IFlatList, ICell, IBudgetItem } from "../core";
import { ITreeItem } from "./interfaces";

/**
 * Обходит дерево таблицы и возвращает список ячеек.
 * Требуется для сохранения в хранилище приложения
 * плоского списка с данными ячеек.
 */
export function getCellsFlatList(rows: IRow[]) {
  let list: IFlatList = {};

  rows.forEach((row: IRow) => {
    row.cells.forEach((cell: ICell) => {
      list[cell.key] = cell;
    });

    if (row.children && row.children.length) {
      list = Object.assign({}, list, getCellsFlatList(row.children));
    }
  });

  return list;
}

/**
 * Преобразует массив возвращенных объектов в объект (словарь).
 * @param {ICell[]} cells
 * @return {IFlatList}
 */
export function arrayToObject(cells: ICell[]) {
  const list: IFlatList = {};

  cells.forEach((cell: ICell) => {
    list[cell.key] = cell;
  });

  return list;
}

/**
 * Возвращает статью с дочерними статьями.
 * @param {IBudgetItem[]} items
 * @param {IBudgetItem} item
 * @return {ITreeItem}
 */
export function getItemWithChildren(items: IBudgetItem[], item: IBudgetItem, index: number) {
  let childrenTemp: ITreeItem[] = [];

  // Обрабатываем все дочерние элементы
  childrenTemp = items
    .filter((childItem: IBudgetItem) => childItem.parentId === item.id)
    .sort((a, b) => a.sort < b.sort ? -1 : 1)
    .map((childItem: IBudgetItem, childIndex: number) => getItemWithChildren(items, childItem, childIndex + 1)) as ITreeItem[];

  return {
    id: item.id,
    title: item.title,
    type: item.type,
    sort: item.sort,
    parentId: item.parentId ? item.parentId : null,
    budgetItemFinanceType: item.budgetItemFinanceType,
    label: item.title,
    color: item.color,
    formula: item.formula,
    children: childrenTemp,
  } as ITreeItem;
}

/**
 * Возвращает древовидную структуру статей для компонента.
 */
export function generateTreeBudgetItems(budgetItems: IBudgetItem[]): ITreeItem[] {
  // Считаем, что первый уровень не имеет родителя
  return budgetItems
    .filter((item: IBudgetItem) => !item.parentId)
    .sort((a, b) => a.sort < b.sort ? -1 : 1)
    .map((item: IBudgetItem, index: number) => getItemWithChildren(budgetItems, item, index + 1));
}

/**
 * Удаляет из объекта переданный массив полей.
 */
export function removeObjectProps(data: ITreeItem, props = ["children", "label", "parent"]) {
  props.forEach(propName => {
    delete data[propName as keyof ITreeItem];
  });
}

/**
 * Устанавливает минимальный интервал между вызовами указанной функции.
 * Использует переданный объект в качестве монитора.
 */
export function debounce(callback: () => void, timeout: number, timeoutHolder: { bounce?: boolean; }) {
  if (timeoutHolder.bounce) {
    return;
  }

  callback();

  timeoutHolder.bounce = true;
  setTimeout(() => timeoutHolder.bounce = false, timeout);
}

/**
 * Возвращает преобразованную строку, где первый символ заглавный.
 * @param {string} str
 * @return {string}
 */
export function ucFirst(str: string) {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
}
