<template lang="pug">
    .home
        h1 {{ $route.name }}

        el-form.add-new-month(label-width="200px" @submit.native.prevent)
            el-form-item(label="Выберите месяц" prop="month" ref="createCost")
                el-date-picker(
                v-model="date"
                type="month"
                placeholder="Выберите месяц"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-ddThh:mm:ss")

            el-form-item
                el-button(
                type="primary"
                @click="createMonth"
                :disabled="!date"
                ) Добавить месяц
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { Repositories } from "../../core";

  /**
   * Класс компонента страницы для создания таблицы расходов для нового месяца.
   */
  @Component
  export default class CreateCostPage extends Vue {
    public date: Date | null = null;

    /**
     * Метод для создания пустой таблицы расходов для указанных организации и даты.
     */
    public async createMonth () {
      if (this.date) {
        try {
          // Обработка запроса
          const orientationId = Number(this.$route.params.id);
          const date = `${String(this.date).split("T")[0]}T00:00:00`;

          await Repositories.tables.createTable({
            dateTime: date,
            organizationId: orientationId,
          });

          // Загрузка данных для построения меню и т д.
          this.$store.dispatch("getMyOrganizationList");

          this.$store.commit("addNotification", {
            title: "",
            message: "Месяц успешно добавлен.",
          });

          // Переход на созданную страницу.
          // год-месяц-число
          const dateShort  = String(date).split("T")[0];
          this.$router.push(`/tables/${orientationId}/${dateShort}`);

        } catch (error) {
          console.log("error", error);
          // Выводим уведомление пользователю
          this.$store.commit("addNotificationError", error);
        }
      }
    }

  }
</script>

<style lang="scss">
    .add-new-month {
        margin-top: 30px;
    }
</style>