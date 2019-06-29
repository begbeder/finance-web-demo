import Vue from "vue";
import VueTheMask from "vue-the-mask";
import App from "./App.vue";
import router from "./router/router";
import store from "./store";

import "../src/styles/main.scss";
import "./support/initApi";
import "./support/sentry";

import {
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  Button,
  Checkbox,
  Switch,
  Select,
  Option,
  Table,
  TableColumn,
  Col,
  ColorPicker,
  Row,
  Form,
  FormItem,
  Loading,
  Tree,
  Alert,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Notification,
} from "element-ui";

import lang from "element-ui/lib/locale/lang/ru-RU";
import locale from "element-ui/lib/locale";

locale.use(lang);

Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(DatePicker);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Col);
Vue.use(ColorPicker);
Vue.use(Row);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tree);
Vue.use(Alert);
Vue.use(Container);
Vue.use(Header);
Vue.use(Alert);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Loading);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;

Vue.config.productionTip = false;

Vue.use(VueTheMask);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
