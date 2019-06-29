export { default  as AxiosFactory } from "./AxiosFactory";
export { default  as UrlFactory } from "./UrlFactory";

import RepositoriesContainer from "./RepositoriesContainer";
export { RepositoriesContainer };

export * from "./resources";
export * from "./enumerations";
export * from "./parameters";

const Repositories = RepositoriesContainer.instance;

export { Repositories };
