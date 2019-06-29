/**
 * Допустимые каналы доставки сообщений клиентам.
 */
enum NotificationChannel {
  /**
   * Сообщения не доставляются.
   */
  None = "none",
  /**
   * СМС.
   */
  Sms = "sms",
  /**
   * Электронная почта.
   */
  Email = "email",
  /**
   * WhatsApp.
   */
  WhatsApp = "whatsapp",
  /**
   * Telegram (организация, запрещенная на территории Российской Федерации).
   */
  Telegram = "telegram",
  /**
   * Viber.
   */
  Viber = "viber",
  /**
   * Push-уведомления через мобильное приложение.
   */
  Push = "push",
}

export default NotificationChannel;
