// export * from "./interfaces";

export { default as IResource } from "./IResource";

// Аутентификация и системные вызовы
export { default as ISuccessfulAuthentication } from "./auth/ISuccessfulAuthentication";

// Пользователи
export * from "./users/IUser";

// Рестораны
export * from "./restaurants/IRestaurant";

// Организации
export * from "./organizations/IOrganization";

// Таблица расходов
export * from "./tables/ITable";

// Статьи бюджета
export * from "./budget/IBudgetItem";

// Сайты
export * from "./sites/ISite";
