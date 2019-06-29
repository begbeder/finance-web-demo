<template src="./BudgetItemsEditor.pug" lang="pug"></template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import { ITreeItem, ITreeNode, generateTreeBudgetItems } from "../../support";
  import { ITable, IRow, IPlan, Repositories, RowTypes } from "../../core";
  import { AxiosPromise } from "axios";

  /**
   * Интерфейс модели данных о выбранных узлах, возвращается компонентом el-tree.
   */
  export interface ICheckData {
    checkedKeys: number[];
    checkedNodes: ITreeNode[];
    halfCheckedKeys: number[];
    halfCheckedNodes: ITreeNode[];
  }

  /**
   *  Интерфейс модели данных одного плана.
   */
  export interface IPlanWithType extends IPlan {
    id: number;
    type: RowTypes;
  }

  /**
   * Интерфейс модели данных списка планов статей таблицы в виде словаря.
   */
  export interface IPlanList {
    [key: number]: IPlanWithType;
  }

  /**
   * Возвращает список всех планов статей таблицы (редактора)
   */
  function getPlans(rows: IRow[], organizationData: { id: number; dataTime: Date; }) {
    let plans: IPlanList = {};
    rows.forEach(row => {
      plans[row.budgetItemId] = {
        id: row.planId,
        value: row.planValue,
        budgetItemId: row.budgetItemId,
        organizationId: organizationData.id,
        dateTime: organizationData.dataTime,
        type: row.rowType,
      };

      if (row.children.length) {
        plans = Object.assign({}, plans, getPlans(row.children, organizationData));
      }
    });

    return plans;
  }

  /**
   * Класс компонента редактирования статей.
   */
  @Component({})
  export default class BudgetItemsEditor extends Vue {

    /**
     * Сгенерированное дерево статей бюджета
     */
    public budgetItemsTree: ITreeItem[] = [];

    /**
     * Массив идентификаторов, добавленных в редактор на момент открытия редактора.
     */
    public defaultCheckedKeys: number[] = [];

    /**
     * Массив идентификаторов, еще не сохраненных в апи.
     */
    public checkedKeys: number[] = [];

    public planList: IPlanList = {};

    /**
     * Входной параметр, получающий объект для построения таблицы расходов
     */
    @Prop({ default: null })
    public tableData!: ITable | null;

    /**
     * Входной параметр, получающий флаг видимости окна редактирования статей.
     */
    @Prop({ default: false })
    public visible!: boolean;

    /**
     * Метод обновляет значения дерева статей бюджета
     */
    public updateTree() {
      this.updateBudgetTree();
    }

    /**
     * Загружает список статей и обновляет дерево статей.
     */
    public async updateBudgetTree() {
      try {
        // Загружаем общий список статей
        const budgetItems = await Repositories.budgetItem.getList();

        // Генерируем дерево статей расходов
        if (budgetItems.length) {
          this.budgetItemsTree = generateTreeBudgetItems(budgetItems);
        }

        // Устанавливаем связь с текущей таблицей расходов
        if (this.tableData) {
          const planList = getPlans(this.tableData.rows, {
            id: this.tableData.tableQuery.organization.id,
            dataTime: this.tableData.tableQuery.dateFrom,
          });

          // Инициализация данных
          this.planList = planList;
          this.defaultCheckedKeys = (Object.keys(planList)).map(id => Number(id));
          this.checkedKeys = this.defaultCheckedKeys;
        }
      } catch (error) {
        console.log(error);

        this.$store.commit("addNotificationError", error);

      }

    }

    /**
     * Метод вызывается при изменении активности статьи в компоненте дерева.
     */
    public async handleCheckChange(checkNode: ITreeNode, tree: ICheckData) {
      this.checkedKeys = tree.checkedKeys;
    }

    /**
     * Формирует данные для запроса к апи.
     * Определяет тип изменения и устанавливает нужных обработчик удаления или создания.
     */
    public async saveChanges() {
      // Массив обработчиков запросов
      const planListPromises: [AxiosPromise<IPlan>] | any[] = [];

      for (const budgetItemId in this.planList) {
        if (this.planList.hasOwnProperty(budgetItemId) && Number(budgetItemId)) {
          if (this.checkedKeys.includes(Number(budgetItemId))) {
            // Если план имеет тип редактируемый и идентификаор 0, то создаем новый план
            if (!this.planList[budgetItemId].id && this.planList[budgetItemId].type === RowTypes.Editable) {
              const data = Object.assign({}, this.planList[budgetItemId]);
              delete data.id;
              delete data.type;

              planListPromises.push(Repositories.cells.createPlan(data));
            }
          } else {
            planListPromises.push(Repositories.cells.deletePlan(this.planList[budgetItemId].id));
          }
        }
      }

      // Добавление новых планов.
      this.checkedKeys
          .filter(budgetItemId => !this.defaultCheckedKeys.includes(budgetItemId))
          .forEach(budgetItemId => {
            if (this.tableData) {
              planListPromises.push(Repositories.cells.createPlan({
                value: 0,
                budgetItemId,
                organizationId: this.tableData.tableQuery.organization.id,
                dateTime: this.tableData.tableQuery.dateFrom,
              }));
            }
          });

      try {
        // Дожидаемся выполнения всех обработчиков
        await Promise.all(planListPromises);

        this.$store.commit("addNotification", {
          title: "",
          message: "Изменения успешно сохранены.",
        });

        // Вызывает событие для обновления таблицы
        this.$emit("updated");

      } catch (error) {
        console.log(error);

        this.$store.commit("addNotificationError", error);
      }

    }

    @Watch("tableData")
    public onTableDataChanged() {
      this.updateTree();
    }

    public created() {
      this.updateTree();
    }
  }
</script>