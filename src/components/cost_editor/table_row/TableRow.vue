<template src="./TableRow.pug" lang="pug"></template>
<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import { IRow } from "../../../core";

  // Компоненты
  import EditableCell from "../editable_cell/EditableCell.vue";
  import PlanCell from "../plan_cell/PlanCell.vue";
  import RowControl from "../row_control/RowControl.vue";

  /**
   * Класс компонента статьи расходов в редакторе
   * Содержит компоненты для управления вложенностью,
   * значением плана на период и ячейками для редактирования значений.
   */
  @Component({
    name: "table-row",
    components: {
      "table-row": TableRow,
      EditableCell,
      PlanCell,
      RowControl,
    },
  })
  export default class TableRow extends Vue {

    /**
     * Входные данные содержимого строки таблицы
     */
    @Prop()
    public rowData!: IRow;

    /**
     * Уровень вложенности текущего элемента
     */
    @Prop({ default: 0 })
    public levelRow!: number;

    /**
     * Количество элементов на данном уровне
     */
    @Prop()
    public countSiblings!: number;

    /**
     * Индекс текущей строки относительно соседей в плоском списке
     */
    @Prop()
    public indexRow!: number;

    /**
     * Флаг отображения группы дочерних элементов
     */
    public rowIsOpen: boolean = true;

    /**
     * Флаг наличия дочерних элементов
     */
    get rowHasChildren () {
      return !!(this.rowData.children && this.rowData.children.length);
    }

    /**
     * Возвращает количество дочерних элементов
     */
    get countChildren() {
      return this.rowHasChildren ? this.rowData.children.length : [];
    }

    /**
     * Вычисляемое значение, возвращает отсортированный по ключу массив ячеек строки таблицы
     */
    get sortedCells () {
      return (this.rowData && this.rowData.cells.length) ?
        this.rowData.cells : [];
    }

    /**
     * Возращает название css класса для ячейки текущей строки
     */
    get cellClass() {
      const className = `table-cell-level-${this.levelRow}`;

      if (this.rowData && this.rowType === "editable") {
        return "table-cell-editable";
      }

      return className;
    }

    /**
     * Возвращает название строки таблицы
     */
    get rowTitle () {
      return this.rowData.title;
    }

    /**
     * Возращает тип строки таблицы
     */
    get rowType () {
        return this.rowData.rowType;
    }

    /**
     * Скрывает/показывает дочерние элементы
     */
    public toggleChildren () {
      if (this.rowHasChildren) {
        this.rowIsOpen = !this.rowIsOpen;
      }
    }
  }
</script>

<style src="./TableRow.scss" lang="scss"></style>