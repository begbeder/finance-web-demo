<template src="./RowControl.pug" lang="pug"></template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";

  /**
   * Класс компонента, осуществляющего управляение вложенностью таблицы
   */
  @Component
  export default class RowControl extends Vue {
    /**
     * Наличие дочерних элементов
     */
    @Prop()
    public hasChildren!: boolean;

    /**
     * Параметр, отвечающий за отображение дочерних элементов
     */
    @Prop()
    public isOpen!: boolean;

    /**
     * Уровень вложенности текущего элемента
     */
    @Prop({ default: 0 })
    public level!: number;

    /**
     * Индекс текущего элемента
     */
    @Prop()
    public index!: number;

    /**
     * Количество элементов на данном уровне
     */
    @Prop()
    public countSiblings!: number;
  }
</script>

<style src="./RowControl.scss" lang="scss"></style>