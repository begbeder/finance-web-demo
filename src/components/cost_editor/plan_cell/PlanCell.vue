<template src="./PlanCell.pug" lang="pug"></template>

<script lang="ts">
  import { Component } from "vue-property-decorator";
  import { ICell, Repositories } from "../../../core";
  import { BlurHandlerMode } from "../editable_cell_base/EditableCellBase.vue";
  import EditableCell from "../editable_cell/EditableCell.vue";
  import { arrayToObject } from "../../../support";

  /**
   * Класс компонента, который позволяет задать план для статьи расходов
   * Изменение значения плана стратьи на период
   * Сохраняет данные для новой строки
   */
  @Component
  export default class PlanCell extends EditableCell {

    /**
     * Возвращаемое значение, определяет блокировку кнопки сохранения
     */
    get isDisabled() {
      return this.newValue === this.value;
    }


    /**
     * Устанавливает режим обработки потери фокуса
     */
    public async changeMode() {
      this.blurHandlerMode = BlurHandlerMode.Apply;
    }

    /**
     * Вызывается по окончанию ввода данных
     * @param {KeyboardEvent} event
     * @return {Promise<void>}
     */
    public async cancelEdit (event: KeyboardEvent) {
      /**
       * Задержка требуется для правильной последовательности вызова методов,
       * Сначала changeMode потом cancelEdit
       */
      setTimeout(async () => {
        try {

          let data: ICell[] = [];
          // Сохранение производится только если значение ячейки изменилось
          if (this.newValue !== this.value) {
            // Обновляем значения только колонки План.
            if (this.blurHandlerMode === BlurHandlerMode.Save) {
              const planId = this.cell.planId;
              data = await Repositories.cells.planUpdate({
                planId,
                fillMonth: false,
                value: this.newValue,
              });
            }

            // Обновляем значения колонки План и зависимых он него
            if (this.blurHandlerMode === BlurHandlerMode.Apply) {
              const planId = this.cell.planId;
              data = await Repositories.cells.planUpdate({
                planId,
                fillMonth: true,
                value: this.newValue,
              });
            }

            if (this.blurHandlerMode !== BlurHandlerMode.Reset) {
              // Обновление хранилища приложения
              this.$store.commit("updateCellList", arrayToObject(data));

              // Сигнализируем, что сохранено успешно
              this.isValid = true;
              setTimeout(() => {
                this.isValid = null;
              }, 5000);

              // Обновление значений
              // Генерирует событие для апи компонента
              this.$emit("change", this.cell, this.newValue);
            }
          }

          // Сбрасываем изменения значения
          if (this.blurHandlerMode === BlurHandlerMode.Reset) {
            this.resetEdit();
          }

        } catch (error) {
          // Обработка ошибок
          this.isValid = false;
          console.log(error);

          // Выводим уведомление пользователю
          this.$store.commit("addNotificationError", error);
        }
      }, 100);
    }

  }
</script>

<style src="./PlanCell.scss" lang="scss"></style>