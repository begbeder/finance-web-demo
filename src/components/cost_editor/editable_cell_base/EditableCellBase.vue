<template lang="pug">
    // Если поле редактируемое, то обрабатываем изменение значения
    span.editable(
    ref="editable"
    v-if="contentEditable"
    contenteditable
    @input="onInput"
    @keyup="onKeyUp"
    :class="{ 'invalid': isValid === false, 'is_saved': isValid }"
    )

    // Иначе просто выводим входное значение
    span.editable(v-else ref="editable") {{ formatValue(value) }}
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import { ICell } from "../../../core";

  /**
   * Перечисление возможных значений режима обработки потери фокуса
   */
  export enum BlurHandlerMode {
    Save  = "save",
    Reset = "reset",
    Apply = "apply",
  }

  /**
   * Возвращает позицию курсора внутри редактируемого
   * @param {HTMLElement} editableDiv
   * @return {number}
   */
  function getCaretPosition(editableDiv: HTMLElement) {
    let caretPos = 0, sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (range.commonAncestorContainer.parentNode === editableDiv) {
          caretPos = range.endOffset;
        }
      }
    }

    return caretPos;
  }

  /**
   * Устанавливает курсор в заданную позицию на редактируемом элементе
   * @param {HTMLElement} editableElement
   * @param {number} position
   */
  function setCaretPosition(editableElement: HTMLElement, position: number) {
    if (editableElement) {
      editableElement.focus();

      if (editableElement.firstChild) {
        const sel = window.getSelection();
        sel.collapse(editableElement.firstChild, position);
      }
    }
  }

  @Component
  export default class EditableCellBase extends Vue {

    /**
     * Входной параметр, определяющий возможность редактирования
     */
    @Prop({ default: false })
    public contentEditable!: boolean;

    /**
     * Принимаемое значение редактируемой ячейки
     */
    @Prop()
    public cell!: ICell;

    /**
     * Переменная определяет, что нужно делать в обработчике события потери фокуса
     * сохранять/сбрасывать значение, по умолчанию сохранять
     */
    public blurHandlerMode: BlurHandlerMode = BlurHandlerMode.Save;

    /**
     * Переменная определяет наличие ошибки,
     * По умолчанию не задано
     */
    public isValid: boolean | null = null;

    /**
     * Содержит введенный и преобразованный текст для $emit
     */
    public newValue: number = 0;

    /**
     * Возвращает данные ячейки по идентификатору
     */
    get cellData() {
      return (this.$store.state.tables && this.cell.key) ?
        this.$store.state.tables.cellList[this.cell.key] : null;
    }

    /**
     * Возвращает значение ячейки
     */
    get value() {
      return this.cellData.value;
    }

    /**
     * Синхронизирует значение, если оно изменилось вне компонента
     */
    @Watch("value")
    public onChangedValue() {
      this.initValue();
    }

    /**
     * Возвращает значение с 2 знаками после запятой, разбитое на разряды
     */
    public formatValue(value: number) {
      value = Math.round(value * 100) / 100;

      return value.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
    }

    /**
     * Обрабатывает событие ввода данных
     * Осуществляет очистку данных согласно требованиям (чистовые, положительные, с 2 зн после занятой)
     */
    public onInput(event: any) {
      // Введенное значение до всех обработок
      const rawValue = event.target.innerText;
      const rawValueLength = rawValue.length;

      // Оставляем в строке только цифры и разделитель.
      let replacedValue = "";
      if ((0.1).toString().includes(",")) {
        replacedValue = rawValue.replace(/[^,\d]/g, "");
      } else {
        replacedValue = rawValue.replace(/[^.\d]/g, "");
      }

      // Если после замены остается пустая строка, то устанавливаем значение по умолчанию
      if (replacedValue === "") {
        replacedValue = "0";
      }

      // Возвращает положение курсора в момент ввода.
      let caretPosition = getCaretPosition(event.target);

      // Приведение к числовому значению и обработка результата с 2 точками
      const newValue = Number(parseFloat(replacedValue));

      // Обновление содержимого элемента
      (this.$refs.editable as HTMLElement).innerText = this.formatValue(newValue) as string;

      // Возврат курсора на позицию в момент ввода
      const newValueLength = (this.formatValue(newValue)).length;
      if (rawValueLength > newValueLength) {
        caretPosition = caretPosition - (rawValueLength - newValueLength);
        if (caretPosition < 1) {
          caretPosition = 0;
        }
        setCaretPosition(event.target, caretPosition);
      } else {
        setCaretPosition(event.target, caretPosition);
      }

      // Преобразуем к числовому типу и записываем в переменную для послед. использования
      this.newValue = Math.round(newValue * 100) / 100;
    }

    /**
     * Обрабатывает событие нажатия клавиши клавиатуры
     */
    public onKeyUp(event: KeyboardEvent) {
      // Esc
      const keyEscape = event.key && event.key.indexOf("Esc") === 0;
      if (keyEscape) {
        this.blurHandlerMode = BlurHandlerMode.Reset;

        // Сброс фокуса с выбранного элемента
        (this.$refs.editable as HTMLElement).blur();
      }
    }

    /**
     * Вызывается по окончанию ввода данных
     * Генерирует событие для директивы v-model
     */
    public async cancelEdit(event: KeyboardEvent) {
      if (this.blurHandlerMode === BlurHandlerMode.Reset) {
        this.resetEdit();
      }
    }

    /**
     * Сбрасывает введенное значение на то, которое было до ввода
     */
    public resetEdit() {
      (this.$refs.editable as HTMLElement).innerText = this.formatValue(this.value) as string;

      // Устанавливаем значение по умолчанию
      this.blurHandlerMode = BlurHandlerMode.Save;

      // Сбрасывает новое значение до значения по умолчанию
      this.newValue = this.value;

      this.isValid = null;
    }

    /**
     * Устанавливает значение, переданное через входной параметр
     */
    public initValue() {
      // Сихронихирует новое значение с входящим значением
      this.newValue = this.value;

      // Устанавливаем начальное значение для редактируемого поля если доступна возможность редактирования
      if (this.contentEditable) {
        (this.$refs.editable as HTMLElement).innerText = this.formatValue(this.value) as string;
      }
    }

    public mounted() {
      this.initValue();
    }
  }
</script>

<style src="./EditableCellBase.scss" lang="scss"></style>