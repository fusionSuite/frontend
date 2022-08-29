import { IProperty } from './property';

export interface IType {
  id: number;
  internalname: string;
  properties: IProperty[];
}
