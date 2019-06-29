<template lang="pug">
    #app
        el-container
            // Шапка сайта
            el-header.main-header
                // Заголовок сайта
                span.h1 Финансы

                // Блок данных пользователя
                user-block.main-header__user-block(:auth="auth")

            // Основная часть страницы
            el-container()
                // Левое меню
                sidebar(v-if="authenticated")

                // Основной контент
                el-main.main-container(v-loading="$store.state.notifications.loading")
                    router-view(:auth="auth")
</template>
<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import Sidebar from "./components/sidebar/Sidebar.vue";
  import UserBlock from "./components/header/user_block/UserBlock.vue";
  import { AuthService, INotification, NotificationTypes } from "./support";

  const auth  = new AuthService();

  const { authNotifier } = auth;

  @Component({
    components: {
      Sidebar,
      UserBlock,
    },
  })
  export default class App extends Vue {

    /**
     * Экземпляр модуля авторизации, добавлен в компонент для удобной работы,
     * в дочерние передается как входной параметр.
     */
    public auth = auth;

    /**
     * Возвращает истину если пользователь авторизован.
     */
    get authenticated() {
      return this.$store.state.user.userAuthenticated;
    }

    /**
     * Возвращает значения является ли пользователь администратором.
     * @return {boolean}
     */
    get isAdmin() {
      return this.$store.state.user.isAdmin;
    }

    /**
     * Возвращает список уведомлений.
     * @return {INotification[]}
     */
    get notifications() {
      return this.$store.state.notifications.list;
    }

    @Watch("notifications")
    public onNotificationChanged() {
      if (this.notifications.length) {
        // Вывод уведомлений
        this.notifications.forEach((notification: INotification) => {
          if (notification.type === NotificationTypes.Success) {
            this.$notify.success({
              title: notification.title,
              message: notification.message,
            });
          }

          if (notification.type === NotificationTypes.Error) {
            this.$notify.error({
              title: notification.title,
              message: notification.message,
            });
          }
        });

        // Очистка после вывода
        this.$store.commit("updateNotificationList", null);

      }
    }

    public async mounted() {

      // При загрузке приложения определяет авторизован ли пользователь.
      this.$store.commit("userAuthenticated", this.auth.authenticated);

      // При загрузке приложения определяет является ли пользователь администратором.
      this.$store.commit("updateAdminStatus", this.auth.isAdmin());

      try {
        // Обновляет данные в хранилище при изменении статуса авторизации.
        authNotifier.on("authChange", async authState => {
          this.$store.commit("userAuthenticated", authState.authenticated);
          this.$store.commit("updateAdminStatus", authState.admin);

          // Если не авторизован, то перенаправляем на форму авторизации.
          if (this.authenticated) {
            // Если профиль не загружен, то загружаем его.
            if (!this.auth.userProfile) {
              this.auth.getProfile((err: Error) => {
                if (err) {
                  this.$store.commit("addNotificationError", err);

                  return;
                }
              });
            }

            // Повторная загрузка данных для построения меню и т д.
            await this.$store.dispatch("getMyOrganizationList");

          } else {
            this.auth.login();
          }
        });

        // Загрузка данных для построения меню и т д.
        await this.$store.dispatch("getMyOrganizationList");
      } catch (error) {
        console.log(error);

        this.$store.commit("addNotificationError", error);
      }

    }
  }
</script>
<style lang="scss">
    body {
        margin: 0;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }
</style>
