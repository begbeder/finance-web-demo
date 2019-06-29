import IResource from "../IResource";
import { BudgetItemTypes, BudgetItemFinanceTypes } from "../../enumerations";

/**
 * Интерфейс статьи расходов или доходов
 */
export interface IBudgetItem extends IResource {
  title: string | null;
  readOnly?: boolean;
  type: BudgetItemTypes;
  budgetItemFinanceType: BudgetItemFinanceTypes;
  sort: number;
  formula: string;
  color: string | null;
  parentId: number | null;
}
