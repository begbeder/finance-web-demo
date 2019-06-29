<template src="./BudgetItemForm.pug" lang="pug"></template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from "vue-property-decorator";

    import { BudgetItemTypes, BudgetItemFinanceTypes } from "../../core";

    import {
      ITreeItem,
    } from "../../support";

    export interface ISelectTypeOption {
      label: string;
      value: BudgetItemTypes;
    }

    export interface ISelectFinanceTypeOption {
      label: string;
      value: BudgetItemFinanceTypes;
    }

    /**
     * Класс компонента формы создания или редактирования сущности Статья.
     */
    @Component({})
    export default class BudgetItemForm extends Vue {

      /**
       * Исходные данные для редактирования.
       */
      @Prop({})
      public formData!: ITreeItem;

      /**
       * Локальное состояние формы.
       */
      public formDataLocal: ITreeItem = {
        id: 0,
        title: "",
        type: BudgetItemTypes.Editable,
        budgetItemFinanceType: BudgetItemFinanceTypes.Variable,
        parentId: null,
        sort: 1,
        formula: "",
        color: null,
        children: null,
      };

      public financeTypeOptions: ISelectFinanceTypeOption[] = [
        {
          label: "Фиксированный",
          value: BudgetItemFinanceTypes.Fixed,
        },
        {
          label: "Переменный",
          value: BudgetItemFinanceTypes.Variable,
        },
      ];

      /**
       * Доступные для выбора типы статьи.
       */
      public options: ISelectTypeOption[] = [
        {
          label: "Редактируемая",
          value: BudgetItemTypes.Editable,
        },
        {
          label: "Формула",
          value: BudgetItemTypes.Calculated,
        },
        {
          label: "Импорт",
          value: BudgetItemTypes.Import,
        },
      ];

      /**
       * Правила валидации данных статьи
       */
      public rulesBudgetItemEditorForm = {
        title: [
          { required: true, message: "Введите название статьи", trigger: "blur" },
        ],
      };

      @Watch("formData")
      public updateFormData() {
        this.formDataLocal = Object.assign({}, this.formData);

        // Сброс валидации при обновлении данных.
        (this.$refs.budgetItemForm as any).clearValidate();
      }

      public mounted () {
        this.updateFormData();
      }

    }
</script>

<style lang="scss">
    .select-item {
        width: 100%;
    }
</style>