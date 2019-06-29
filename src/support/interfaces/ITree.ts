import { IBudgetItem } from "../../core";

// Интерфейс данных узла дерева статей.
export interface ITreeItem extends IBudgetItem {
  label?: string;
  children: ITreeItem[] | null;
}

// Интерфейс узла дерева статей.
export interface ITreeNode {
  id: number;
  data: ITreeItem;
  parent: ITreeNode;
  childNodes: ITreeNode[];
  expanded: boolean;
  store: any;
}
