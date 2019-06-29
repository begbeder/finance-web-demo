import { Module, ActionContext } from "vuex";
import { RootState } from "..";
import { ITable, IRestaurant, IFlatList, IOrganization, Repositories } from "../../core";

/**
 * Интерфейс состояния модуля списка таблиц.
 */
export interface ITableStoreState {
  tableList: {
    [id: number]: ITable[];
  };
  restaurantList: IRestaurant[];
  cellList: IFlatList;
  organizationList: IOrganization[];
}

const stateFactory = (): ITableStoreState => ({
  tableList: {},
  restaurantList: [],

  // Содержит список ячеек ввиде словаря.
  cellList: {},
  organizationList: [],
});

const mutations = {
  /**
   * Модификатор состояния приложения, устанавливает загруженные таблицы по идентификатору организации.
   */
  updateTableList(state: ITableStoreState, payload: { id: number, tables: ITable[] | any[] }) {
    state.tableList[payload.id] = payload.tables;
  },

  /**
   * Модификатор состояния приложения, устанавливает загруженные рестораны.
   */
  updateRestaurantList(state: ITableStoreState, restaurants: IRestaurant[]) {
    state.restaurantList = restaurants;
  },

  /**
   * Модификатор состояния приложения, обновляет список значений ячеек.
   */
  updateCellList(state: ITableStoreState, cellList: IFlatList) {
    state.cellList = Object.assign({}, state.cellList, cellList);
  },

  updateOrganizationList (state: ITableStoreState, organizationList: IOrganization[]) {
    state.organizationList = organizationList;
  },
};

const actions = {
  /**
   * Получет список организаций
   */
  async getMyOrganizationList (context: ActionContext<ITableStoreState, RootState>) {
    const organizationList = await Repositories.organizations.getListMyOrganizations() as IOrganization[];

    if (organizationList.length) {
      const ids = organizationList.map((item: IOrganization) => item.id);
      await context.dispatch("getOrganizationTableList", ids);

      context.commit("updateOrganizationList", organizationList);
    }
  },

  /**
   * Загружает список таблиц по указанным идентификаторам организаций
   * @param {ActionContext<ITableStoreState, >} context
   * @param {number[]} ids
   */
  async getOrganizationTableList (context: ActionContext<ITableStoreState, RootState>, ids: number[]) {
    const tableRequests = ids.map(id => Repositories.organizations.getTableList(id));

    const tables = await Promise.all(tableRequests);

    ids.forEach((id, index) => {
      context.commit("updateTableList", { id, tables: tables[index]});
    });
  },
};

const module: Module<ITableStoreState, RootState> = {
  state: stateFactory,
  mutations,
  actions,
};

export default module;
