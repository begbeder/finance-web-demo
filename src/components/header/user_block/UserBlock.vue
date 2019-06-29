<template lang="pug">
    .user-block
        el-dropdown(
        v-if="authenticated"
        trigger="click"
        @command="handleCommandDropdown")
            span.user-block__control.el-dropdown-link
                i(v-if="!userProfile").user-block__avatar.el-icon-service
                .user-block__avatar.picture(v-else :style="{ backgroundImage: `url(${userProfile.picture})` }")
                div.user-block__name
                    span.user-block__nickname {{ nickname }}
                    span.user-block__role {{ isAdmin ? "Администратор" : "Менеджер" }}
                i.user-block__expand-icon.el-icon-arrow-down.el-icon--right

            el-dropdown-menu(slot="dropdown")
                el-dropdown-item(:disabled="true" command="info") Информация
                el-dropdown-item(command="logout") Выйти

        .user-block__button(v-else)
            el-button(type="primary" size="mini" @click="auth.login()") Авторизоваться
</template>

<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";

  import { AuthService, ucFirst } from "../../../support";

  /**
   * Интерфейс данных пользователя.
   */
  export interface IUserProfile {
    name: string;
    nickname: string;
    email: string;
  }

  /**
   * Класс компонента данных пользователя в шапке.
   */
  @Component
  export default class UserBlock extends Vue {

    /**
     * Переданный экземпляр модуля авторизации.
     */
    @Prop()
    public auth!: AuthService;

    /**
     * Данные профиля пользователя.
     */
    public userProfile: IUserProfile | null = null;

    /**
     * Возвращает истину если пользователь авторизован.
     */
    get authenticated() {
      return this.$store.state.user.userAuthenticated;
    }

    /**
     * Возвращает никнейм пользователя.
     */
    get nickname() {
      return this.userProfile ? ucFirst(this.userProfile.nickname) : "Пользователь";
    }

    /**
     * Возвращает значения является ли пользователь администратором.
     * @return {boolean}
     */
    get isAdmin() {
      return this.$store.state.user.isAdmin;
    }

    /**
     * Метод для обработки нажатия элементов дропдаун компонента.
     * @param {string} command
     */
    public handleCommandDropdown(command: string) {
      switch (command) {
        case "logout":
          this.auth.logout();
          break;

        case "info":
          break;
      }
    }

    public created() {
      if (this.auth && this.auth.userProfile) {
        this.userProfile = this.auth.userProfile;
      } else {
        this.auth.getProfile((err: Error, profile: IUserProfile) => {
          if (err) {
            this.$store.commit("addNotificationError", err);

            return;
          }

          this.userProfile = profile;
        });
      }
    }
  }
</script>

<style lang="scss">
    @import "../../../styles/variables";

    $user-block-color: #fff;
    .user-block {
        cursor: pointer;

        &__control {
            display: flex;
            align-items: center;
            height: 100%;
            color: $user-block-color;
        }
        &__avatar {
            font-size: 18px;
            margin-right: 15px;

            &.picture {
                display: inline-flex;
                width: 40px;
                height: 40px;
                background-size: cover;
                background-position: center;
                border-radius: 50%;
            }
        }

        &__nickname {
            line-height: 1.4;
        }

        &__role {
            line-height: 1;
            font-size: 12px;
            color: #95a1ab;
        }

        &__name {
            display: flex;
            flex-direction: column;

        }

        &__expand-icon {
            margin-left: 10px;
        }
    }
</style>