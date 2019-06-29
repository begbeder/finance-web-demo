<template src="./CostEditor.pug" lang="pug">
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import { ITable, IRow } from "../../core";

  import TableRow from "./table_row/TableRow.vue";

  /**
   * Класс компонента редактора расходов
   * Компонент получаем данные для построения из родителя.
   */
  @Component({
    components: {
      TableRow,
    },
  })
  export default class CostEditor extends Vue {

    /**
     * Входной параметр, получающий объект для построения таблицы расходов
     */
    @Prop({ default: null })
    public tableData!: ITable | null;

    /**
     * Возвращает отсортированный по ключу массив ячеек шапки таблицы
     */
    get sortedCellsHeader () {
      return (this.tableData && this.tableData.columns && this.tableData.columns.length) ?
        this.tableData.columns : [];
    }

    /**
     * Данные для построения строки Итого
     */
    get totalRow () {
      return this.tableData ?
        this.tableData.rows.find((row: IRow) => row.rowType === "total") : null;
    }

    /**
     * Вызывается при горизонтальной прокрутке таблицы и синхронизирует прокрутку всех ее частей
     * @param {Event} event
     * @return {void}
     */
    public syncScrollHandler (event: Event) {
      if (event && event.srcElement) {
        const left = event.srcElement.scrollLeft;

        const tableContent = this.$refs.tableContent as Element;
        tableContent.scrollLeft = left;

        const tableHeader = this.$refs.tableHeader as Element;
        tableHeader.scrollLeft = left;

        const tableFooter = this.$refs.tableFooter as Element;
        tableFooter.scrollLeft = left;
      }
    }
  }
</script>

<style src="./CostEditor.scss" lang="scss"></style>