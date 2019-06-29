<template lang="pug">
    el-aside.sidebar(
    width="280px"
    )
        // Элемент меню
        el-menu(:router="true" :default-active="activeLink")
            el-submenu(index="1")
                // Раздел меню Расходы
                template(v-if="restaurantMenu && restaurantMenu.length")
                    template(slot="title") Расходы
                    template(v-for="restItem in restaurantMenu")
                        // 1 ресторан
                        el-submenu(:index="`${restItem.id}-1`")
                            // Название ресторана
                            template(slot="title") {{ restItem.title }}

                            // Список месяцев
                            el-menu-item(
                            v-for="costItem in restItem.costs"
                            :key="costItem.id"
                            :index="costItem.path"
                            @click="pushRoute(costItem.path)"
                            ) {{ costItem.title }}

                            // Добавление нового месяца расходов
                            el-menu-item(
                            v-if="!readonly"
                            :index="`/tables/${restItem.id}/new-month`"
                            @click="pushRoute(`/tables/${restItem.id}/new-month`)"
                            )
                                i.el-icon-plus
                                span Добавить месяц

            // Администрирование
            el-submenu(index="admin" v-if="isAdmin")
                template(slot="title") Администирование

                // Редактирование статей
                el-menu-item(
                index="/edit-budget"
                @click="pushRoute('/edit-budget')"
                ) Редактирование статей

                // Редактирование организаций
                el-menu-item(
                index="/edit-organizations"
                @click="pushRoute('/edit-organizations')"
                ) Редактирование организаций

</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";

  import { IRestaurantMenuItem, IOrganization, ITable } from "../../core";

  import { ucFirst } from "../../support";

  /**
   * Класс компонента левого меню.
   */
  @Component
  export default class Sidebar extends Vue {
    /**
     * Входной параметр, отвечает за возможность редактирования левого меню,
     * например, создания нового месяца.
     * @param {boolean} readonly
     */
    @Prop({ default: false })
    public readonly!: boolean;

    public restaurantMenu: IRestaurantMenuItem[] | null = null;

    /**
     * Возвращает полный путь страницы (кроме домена),
     * используется для выделения текущей страницы в левом меню.
     */
    get activeLink () {
      return decodeURIComponent(this.$route.fullPath);
    }

    /**
     * Возвращает значения является ли пользователь администратором.
     * @return {boolean}
     */
    get isAdmin () {
      return this.$store.state.user.isAdmin;
    }

    /**
     * Возвращает список организаций.
     */
    get organizationList () {
      return this.$store.state.tables.organizationList;
    }

    /**
     * Возвращает список таблиц разбитый по организациям в виде словаря.
     */
    get organizationTableList () {
      return this.$store.state.tables.tableList;
    }

    @Watch("organizationList")
    public onOrganizationListChanged () {
      this.generateMenu();
    }

    @Watch("organizationTableList")
    public onOrganizationTableListChanged () {
      this.generateMenu();
    }

    /**
     * Создает структуру меню для сайдбара
     */
    public generateMenu () {
      if (this.organizationList.length) {
        const menu = this.organizationList.map((organization: IOrganization) => {
          // Генерация списка расходов
          const costs: any[] = [];
          const tables = this.organizationTableList[organization.id];
          if (tables && tables.length) {
            tables.forEach((table: ITable) => {
              if (table.tableQuery.dateFrom) {
                const date = new Date(table.tableQuery.dateFrom);
                const monthName = date.toLocaleString("ru-Ru", { month: "long" });
                const fullYear = date.getFullYear();

                // год-месяц-число
                const dateShort  = String(table.tableQuery.dateFrom).split("T")[0];

                costs.push({
                  title: `${ucFirst(monthName)} ${fullYear}` || "Без названия",
                  path: `/tables/${organization.id}/${dateShort}`,
                });
              }
            });
          }

          return {
            id: organization.id,
            title: organization.title,
            path: `/organizations/${organization.id}`,
            costs,
            reports: [],
          };
        }) as IRestaurantMenuItem[];

        this.restaurantMenu = menu;
      }
    }

    /**
     * Осуществляет переход по заданному адресу.
     * @param {string} path
     */
    public pushRoute(path: string) {
      this.$router.push(path);
    }
  }
</script>

<style lang="scss">
    @import "../../styles/variables";

    .sidebar {
        .el-menu {
            background-color: $sidebar-menu-bg;
            color: $sidebar-menu-color;
            font-size: $sidebar-menu-f-size;
            border-right: 0;
        }

        .el-submenu__title {
            color: $sidebar-menu-color;
            font-size: $sidebar-menu-f-size;
            height: 44px;
            line-height: 44px;

            i { color: $sidebar-menu-color; }

            &:focus,
            &:hover {
                background-color: $sidebar-menu-item-bg;
            }
        }

        .el-menu-item {
            color: $sidebar-menu-color;
            font-size: $sidebar-menu-f-size;
            height: 40px;
            line-height: 40px;

            i { color: $sidebar-menu-color; }

            &.is-active,
            &:focus,
            &:hover {
                background-color: $sidebar-menu-item-bg;
            }
        }
    }
</style>