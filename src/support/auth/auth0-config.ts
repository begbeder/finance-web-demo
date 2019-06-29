/**
 * Конфурационный файл для авторизации с помощью сервиса auth0
 * @type {{clientId: string; domain: string; apiUrl: string}}
 */
export const AUTH_CONFIG = {
  clientId: process.env.VUE_APP_AUTH_CLIENT_ID as string,
  redirectURL: process.env.VUE_APP_AUTH_REDIRECT_URL as string,
  domain: process.env.VUE_APP_AUTH_DOMAIN as string,
  apiUrl: process.env.VUE_APP_AUTH_API_URL as string,
  namespace: process.env.VUE_APP_AUTH_ROLE_NAMESPACE as string,
};

