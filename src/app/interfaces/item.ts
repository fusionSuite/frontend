import { IProperty } from './property';

export interface IItem {
  id: number;
  id_bytype: number;
  name: string;
  parent_id: number;
  treepath: string;
  organization: {
    id: number;
    name: string;
  };
  properties: IProperty[];
}
