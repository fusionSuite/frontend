import { IProperty } from './property';

export interface IItem {
  id: number;
  id_bytype: number;
  name: string;
  parent_id: number|null;
  treepath: string|null;
  organization: {
    id: number;
    name: string;
  };
  properties: IProperty[];
}
