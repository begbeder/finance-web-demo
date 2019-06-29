import { UrlFactory, Repositories } from "../core";

const authApiUrl = process.env.VUE_APP_AUTH_API_URL as string;
const apiUrl = process.env.VUE_APP_API_URL as string;

UrlFactory.instance.setPrefix(apiUrl);

// Данные репозитории работают с другим апи
Repositories.auth.urlFactory = new UrlFactory(authApiUrl);
Repositories.users.urlFactory = new UrlFactory(authApiUrl);
