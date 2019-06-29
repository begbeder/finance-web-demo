/**
 * Интерфейс данных ресторана
 */
export interface IOrganization {
  id: number;
  title: string;
  isActive: boolean;
  externalId: number | null;
}
