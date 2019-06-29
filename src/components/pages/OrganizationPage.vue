<template lang="pug">
    .home
        h1 {{ $route.name }}

        // Форма редактирования организации
        el-form.form-container(
        :model="organizationForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        )
            el-form-item(label="Название организации" prop="title")
                el-input(v-model="organizationForm.title")

            el-form-item(label="Внешний идентификатор" prop="externalId")
                el-input(v-model.number="organizationForm.externalId" type="number")

            el-form-item(label="Активность" prop="isActive")
                el-switch(v-model="organizationForm.isActive")

            // Если страница создания
            el-form-item(v-if="pageIsNew")
                el-button(
                type="primary"
                @click="submitForm"
                ) Cоздать

                el-button(@click="resetForm") Сбросить

            // Если страница редактирования
            el-form-item(v-else)
                el-button(
                type="primary"
                @click="submitForm"
                ) Сохранить

                el-button(type="danger" @click="deleteOrganization") Удалить
</template>

<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import { IOrganization, Repositories } from "../../core";

  /**
   * Класс компонента страницы создания новой организации
   */
  @Component({})
  export default class OrganizationPage extends Vue {
    /**
     * Содержит данные о организации
     * @type {{id: number; title: string; isActive: boolean; externalId: null}}
     */
    public organizationForm: IOrganization = {
      id: 0,
      title: "",
      isActive: true,
      externalId: null,
    };

    /**
     * Правила валидации формы
     * @type {{title: {required: boolean; message: string; trigger: string}[]}}
     */
    public rules = {
      title: [
        { required: true, message: "Введите название организации", trigger: "blur" },
      ],
    };

    get pageIsNew () {
      return !this.$route.params.id;
    }

    get pageId () {
      return this.$route.params.id;
    }

    /**
     * Метод обработки формы
     */
    public submitForm() {
      (this.$refs.ruleForm as any).validate(async (valid: boolean) => {
        if (valid) {
         if (this.pageIsNew) {
           await this.create();
         } else {
           await this.update();
         }
        } else {
          return false;
        }
      });
    }

    /**
     * Сбрасывает введенные данные из формы
     */
    public resetForm() {
      const form = this.$refs.ruleForm as any;
      if (form && form.resetFields) {
        form.resetFields();
      }

      // Сбрасываем данные
      this.organizationForm.id = 0;
      this.organizationForm.title = "";
      this.organizationForm.isActive = true;
      this.organizationForm.externalId = null;
    }

    /**
     * Сохраняет данные о новой организации
     */
    public async create () {
      const data = Object.assign({}, this.organizationForm);

      delete data.id;
      if (!data.externalId) {
        delete data.externalId;
      }

      try {
        const newOrganization = await Repositories.organizations.create(data) as IOrganization;

        this.$store.commit("addNotification", {
          title: "",
          message: "Организация успешно сохранена.",
        });

        this.$router.push(`/organizations/${newOrganization.id}`);
      } catch (error) {
        console.log(error);

        this.$store.commit("addNotificationError", error);
      }
    }

    /**
     * Сохраняет измененные данные об организации
     */
    public async update () {
      // Сейчас апи требует передавать все параметры, включая идентификатор
      const data = Object.assign({}, this.organizationForm);

      try {
        await Repositories.organizations.update(Number(this.pageId), data);

        this.$store.commit("addNotification", {
          title: "",
          message: "Организация успешно изменена.",
        });
      } catch (error) {
        console.log(error);

        this.$store.commit("addNotificationError", error);
      }
    }

    /**
     * Делает запрос на удаление организации
     */
    public async deleteOrganization () {
      try {
        await Repositories.organizations.delete(Number(this.pageId));

        this.$store.commit("addNotification", {
          title: "",
          message: "Организация успешно удалена.",
        });

        // Обновить список организаций
        this.$store.dispatch("getMyOrganizationList");

        // При успешном удалении производится переход на главную страницу.
        this.$router.push("/");
      } catch (error) {
        console.log(error);

        this.$store.commit("addNotificationError", error);
      }
    }

    /**
     * Обновляем данные для построения формы
     */
    public async updateOrganizationData () {
      if (this.pageIsNew) {
        this.resetForm();
      } else {
        // Обновить список организаций
        await this.$store.dispatch("getMyOrganizationList");

        const organization = this.$store.state.tables.organizationList
                         .find((org: IOrganization) => org.id === Number(this.pageId));

        if (organization) {
          this.organizationForm = Object.assign({}, this.organizationForm, organization);
        } else {
          // Если организация не найдена, то перенаправляем пользователя на 404 страницу
          this.$router.push("/404");
        }
      }
    }

    @Watch("$route")
    public onRouteChanged () {
      // Если изменился маршрут обновляем данные
      this.updateOrganizationData();
    }

    public async created () {
      this.updateOrganizationData();
    }
  }
</script>

<style lang="scss">
    .form-container {
        max-width: 500px;
    }
</style>