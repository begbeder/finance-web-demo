# finance-web-demo
Часть компонетнов единого интерфейса бизнес-аналитики организаций.

## Команды для сборки

``` bash
# Установка зависимостей
yarn install

# запуск проекта с горячей перезагрузкой модулей по адресу localhost:8080
yarn start

# сборка в продакшн
yarn build

# Особенности окружения при запуске
Переменные окружения добавляются в корне проекта в файлах ` .env.development и `.env.production.
Только переменные с префиксом VUE_APP_ статически внедряются в клиентскую сборку.