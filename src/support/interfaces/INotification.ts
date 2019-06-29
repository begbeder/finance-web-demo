import { NotificationTypes } from "../index";

/**
 * Интерфейс уведомления.
 */
export interface INotification {
  type: NotificationTypes | null;
  title: string;
  message: string;
}
