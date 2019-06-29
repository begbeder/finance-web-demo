<template src="./EditableCell.pug" lang="pug"></template>

<script lang="ts">
  import { Component } from "vue-property-decorator";
  import { Repositories } from "../../../core";
  import { arrayToObject } from "../../../support";

  import EditableCellBase, { BlurHandlerMode } from "../editable_cell_base/EditableCellBase.vue";

  /**
   * Класс компонента, позволяющего редактировать значения ячейки
   */
  @Component
  export default class EditableCell extends EditableCellBase {

    /**
     * Обрабатывает событие нажатия клавиши клавиатуры
     */
    public onKeyUp (event: KeyboardEvent) {
      // Enter
      const keyEnter = event.key && event.key.indexOf("Ent") === 0;
      if (keyEnter) {
        this.blurHandlerMode = BlurHandlerMode.Save;
      }

      // Esc
      const keyEscape = event.key && event.key.indexOf("Esc") === 0;
      if (keyEscape) {
        this.blurHandlerMode = BlurHandlerMode.Reset;
      }

      // Сброс фокуса с выбранного элемента
      if (keyEnter || keyEscape) {
        (this.$refs.editable as HTMLElement).blur();
      }
    }

    /**
     * Вызывается по окончанию ввода данных
     * Отправляет данные в апи и обрабатывает результат
     * Генерирует событие для директивы v-model
     * Или сбрасывает значение
     */
    public async cancelEdit (event: KeyboardEvent) {
      if (this.blurHandlerMode === BlurHandlerMode.Save && this.newValue !== this.value) {
        try {
          // Сохранение на сервер
          const factId = this.cell.factId;
          const data = await Repositories.cells.factUpdate(factId, this.newValue);

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
        } catch (error) {
          this.isValid = false;
          console.log(error);

          // Выводим уведомление пользователю
          this.$notify.error({
            title: "Ошибка",
            message: error.message || "При сохранении данных произошла ошибка",
          });
        }
      } else {
        // reset mode
        this.resetEdit();
      }
    }
  }
</script>

<style src="./EditableCell.scss" lang="scss"></style>