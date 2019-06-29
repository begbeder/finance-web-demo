<template lang="pug">
    div
        el-button(
        type="primary"
        v-loading.fullscreen.lock="loading") Загрузка...
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";

  /**
   * Класс компонента страницы, на которую попадает пользователь
   * после перехода с формы авторизации.
   */
  @Component
  export default class Callback extends Vue {

    public loading: boolean = true;

    /**
     * Входной параметр, передается из компонейнера приложения.
     */
    @Prop()
    public auth!: any;

    public mounted() {
      // Обрабатывает данные авторизации.
      try {
        this.auth.handleAuthentication();
      } catch (error) {
        this.$store.commit("addNotificationError", error);
      }
    }

    public beforeDestroy() {
      this.loading = false;
    }

  }
</script>