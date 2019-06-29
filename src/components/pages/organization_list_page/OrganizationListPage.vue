<template src="./OrganizationListPage.pug"></template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";

  /**
   * Класс компонента страницы списка организаций.
   */
  @Component
  export default class OrganizationListPage extends Vue {
    /**
     * Возвращает список организаций
     */
    get organizationList () {
      return this.$store.state.tables.organizationList;
    }

    /**
     * Осуществляет переход по заданному адресу.
     * @param {string} path
     */
    public pushRoute(path: string) {
      this.$router.push(path);
    }

    public async created () {
      // Загрузка данных для построения меню и т д.
      try {
        await this.$store.dispatch("getMyOrganizationList");
      } catch (error) {
        console.log(error);

        this.$store.commit("addNotificationError", error);
      }
    }
  }
</script>

<style lang="scss"></style>