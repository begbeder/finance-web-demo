<template lang="pug">
    .home
        // Шапка страницы
        el-row(type="flex" align="middle")
            el-col(:span="16")
                h1 {{ pageTitle ? pageTitle : $route.name }}
            el-col(:span="8")
                .button-wrap
                    el-button(
                    type="primary"
                    size="small"
                    @click="editorBudgetItemsVisible = true"
                    ) Редактировать статьи

        // Редактор
        cost-editor(
        v-if="tableData"
        :tableData="tableData"
        :key="tableData.tableQuery.dateFrom")

        // Окно редактирования статей
        budget-items-editor(
        :tableData="tableData"
        @updated="fetchTableData"
        @close="editorBudgetItemsVisible = false"
        :visible.sync="editorBudgetItemsVisible"
        )
</template>

<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import { ITable, Repositories } from "../../core";
  import { getCellsFlatList } from "../../support";

  import CostEditor from "../cost_editor/CostEditor.vue";
  import BudgetItemsEditor from "../budget_items_editor/BudgetItemsEditor.vue";

  /**
   * Класс компонента страницы редактирования расходов созданного месяца
   * Получает данные по идентификатору и передает из в компонент редактора
   */
  @Component({
    components: {
      CostEditor,
      BudgetItemsEditor,
    },
  })
  export default class CostPage extends Vue {
    /**
     * Данные из апи для построения таблицы
     */
    public tableData: ITable | null = null;

    /**
     * Название страницы
     */
    public pageTitle: string | null = null;

    /**
     * Флаг видимости окна редактирования
     */
    public editorBudgetItemsVisible: boolean = false;

    @Watch("$route")
    public async onRouteChange() {
      this.fetchTableData();
    }

    /**
     * Метод получения данных таблицы по идентификатору.
     */
    public async fetchTableData() {
      try {
        this.$store.commit("toggleLoading", true);

        const dateTime: string = this.$route.params.date;
        const tableId: number = Number(this.$route.params.id);

        const tableData = await Repositories.tables.getTableItem({
          organizationId: tableId,
          dateTime,
        }) as ITable;

        // Записываем в хранилище приложение список ячеек
        if (tableData) {
          const cellList = getCellsFlatList(tableData.rows);
          this.$store.commit("updateCellList", cellList);

          if (tableData.tableQuery.dateFrom) {
            const date = new Date(tableData.tableQuery.dateFrom);
            const monthName = date.toLocaleString("ru-Ru", { month: "long" });
            const fullYear = date.getFullYear();

            this.pageTitle = `${this.$route.name} ${monthName} ${fullYear}`;
          }
        }

        this.tableData = tableData;
        this.$store.commit("toggleLoading", false);
      } catch (error) {
        this.$store.commit("toggleLoading", false);
        console.log(error);

        this.$store.commit("addNotificationError", error);
      }

    }

    public saveChanges() {}

    public created() {
      this.fetchTableData();
    }
  }
</script>

<style lang="scss">
    .button-wrap {
        text-align: right;
    }
</style>