import { Module } from "vuex";
import { RootState } from "..";
import { INotification, NotificationTypes } from "../../support";
import { AxiosError } from "axios";

/**
 * Интерфейс состояния модуля уведомлений сайта.
 */
export interface INotificationsState {
  list: INotification[];
  loading: boolean;
}

export interface ICustomError extends AxiosError {
  error: string;
  statusCode?: number;
}

const stateFactory = (): INotificationsState => ({
  list: [],
  loading: false,
});

const mutations = {
  /**
   * Модификатор состояния приложения, изменяет список уведомлний.
   * @param {INotificationsState} state
   * @param {INotification | null} notification
   */
  updateNotificationList(state: INotificationsState, notification: INotification | null) {
    if (notification) {
      state.list.push(notification);
    } else {
      state.list = [];
    }
  },

  /**
   * Модификатор состояния приложения, добавляет уведомление.
   * @param {INotificationsState} state
   * @param {INotification | null} notification
   */
  addNotification(state: INotificationsState, notification: INotification | null) {
    if (notification) {
      if (!notification.type) {
        notification.type = NotificationTypes.Success;
      }

      state.list.push(notification);
    }
  },

  /**
   * Модификатор состояния приложения, добавляет уведомление с типом ошибка.
   * @param {INotificationsState} state
   * @param {AxiosError} error
   */
  addNotificationError(state: INotificationsState, error: ICustomError) {
    let message = "Произошла ошибка.";

    if (error.response) {
      message = error.response.data.message || error.response.data || error.response.statusText;
    }

    // Обработка ошибки от плагина авторизации.
    if (error.error === "login_required") {
      message = "Требуется авторизация.";
    }

    // Добавлено исключение, т к ошибка авторизации обрабатывается в другом сообщении.
    if (error.statusCode && error.statusCode === 401) {
      return;
    }

    state.list.push({
      type: NotificationTypes.Error,
      title: "Ошибка",
      message,
    });
  },

  toggleLoading(state: INotificationsState, isLoading = false) {
    state.loading = isLoading;
  },
};

const module: Module<INotificationsState, RootState> = {
  state: stateFactory,
  mutations,
};

export default module;
