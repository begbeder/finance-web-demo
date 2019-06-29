import * as Sentry from "@sentry/browser";
import Vue from "vue";

const project = process.env.VUE_APP_SENTRY_PROJECT as string;
const key = process.env.VUE_APP_SENTRY_KEY as string;

// Запуск плагина только для продакшен сборки
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: `https://${key}@sentry.io/${project}`,
    integrations: [new Sentry.Integrations.Vue({ Vue })],
  });
}
