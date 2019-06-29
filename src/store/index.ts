import Vue from "vue";
import Vuex from "vuex";

import user, { IUserStoreState } from "./modules/user";
import tables, { ITableStoreState } from "./modules/tables";
import notifications, { INotificationsState } from "./modules/notifications";

Vue.use(Vuex);

// tslint:disable-next-line:interface-over-type-literal
export type RootState = {
  user: IUserStoreState;
  tables: ITableStoreState;
  notifications: INotificationsState;
};

export default new Vuex.Store<RootState>({
  modules: {
    user,
    tables,
    notifications,
  },
});
