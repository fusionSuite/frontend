import { Property } from './property';
import { PropertyGroup } from './property-group';

export interface Type {
  id: number;
  name: string;
  internalname: string;
  modeling: string;
  created_at: string;
  updated_at: string;
  properties: Property[];
  propertygroups: PropertyGroup[];
}
