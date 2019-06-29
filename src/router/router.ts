import Vue from "vue";
import Router, { NavigationGuard } from "vue-router";

// Страницы проекта
import StartPage from "../components/pages/StartPage.vue";
import CostPage from "../components/pages/CostPage.vue";
import CreateCostPage from "../components/pages/CreateCostPage.vue";
import OrganizationPage from "../components/pages/OrganizationPage.vue";
import BudgetEditorPage from "../components/pages/budget_editor_page/BudgetEditorPage.vue";
import OrganizationListPage from "../components/pages/organization_list_page/OrganizationListPage.vue";

// Служебные страницы
import PageNotFound from "../components/pages/404.vue";
import Callback from "../components/pages/Callback.vue";

// Служебные методы
import { AuthService } from "../support";

Vue.use(Router);

/**
 * Обработчик для стророжевого хука для роутера.
 * Проверяет, авторизован ли пользователь.
 * @param {Route} to
 * @param {Route} from
 * @param {(to?: (RawLocation | false | ((vm: Vue) => any) | void)) => void} next
 */
const requireAuth: NavigationGuard = (to, from, next) => {
  const auth = new AuthService();
  if (!auth.isAuthenticated()) {
    next("/");
  } else {
    next();
  }
};

/**
 * Обработчик для сторожевого хука,
 * обрабатывает маршруты доступные для администратора.
 * @param {Route} to
 * @param {Route} from
 * @param {(to?: (RawLocation | false | ((vm: Vue) => any) | void)) => void} next
 */
const requireAdmin: NavigationGuard = (to, from, next) => {
  const auth = new AuthService();

  if (!auth.isAuthenticated() || !auth.isAdmin()) {
    next(false);
  } else {
    next();
  }
};

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Главная",
      component: StartPage,
    },
    {
      path: "/tables/:id/new-month",
      name: "Создание таблицы расходов для нового месяца",
      component: CreateCostPage,
      beforeEnter: requireAuth,
    },
    {
      path: "/tables/:id/:date",
      name: "Редактирование таблицы расходов за",
      component: CostPage,
      beforeEnter: requireAuth,
    },

    {
      path: "/organizations/new",
      name: "Создание новой организации",
      component: OrganizationPage,
      beforeEnter: requireAdmin,
    },

    {
      path: "/organizations/:id",
      name: "Редактирование организации",
      component: OrganizationPage,
      beforeEnter: requireAdmin,
    },

    {
      path: "/edit-organizations",
      name: "Список организаций",
      component: OrganizationListPage,
      beforeEnter: requireAdmin,
    },

    {
      path: "/edit-budget",
      name: "Редактирования статей доходов и расходов",
      component: BudgetEditorPage,
      beforeEnter: requireAdmin,
    },

    { path: "/404", component: PageNotFound, name: "404. Страница не найдена." },
    { path: "*", redirect: "/404" },
  ],
});
