import { Module } from "vuex";
import { RootState } from "..";

/**
 * Интерфейс состояния модуля данных пользователя.
 */
export interface IUserStoreState {
  userAuthenticated: boolean;
  isAdmin: boolean;
}

const stateFactory = (): IUserStoreState => ({
  userAuthenticated: false,
  isAdmin: false,
});

const mutations = {
  /**
   * Модификатор состояния приложения, устанавливает авторизован ли пользователь.
   * @param {Boolean} isAuthenticated
   */
  userAuthenticated (state: IUserStoreState, isAuthenticated = false) {
    state.userAuthenticated = isAuthenticated;
  },

  /**
   * Модификатор состояния приложения, устанавливает является ли пользователь администратором.
   * @param {IUserStoreState} state
   * @param {boolean} isAdmin
   */
  updateAdminStatus (state: IUserStoreState, isAdmin = false) {
    state.isAdmin = isAdmin;
  },
};

const actions = {};

const module: Module<IUserStoreState, RootState> = {
  state: stateFactory,
  mutations,
  actions,
};

export default module;
