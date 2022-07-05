import { ListValue } from './list-value';

export interface Property {
  id: number;
  name: string;
  internamename: string;
  valuetype: string;
  unit: string;
  default: string;
  description: null|string;
  created_at: string;
  updated_at: string;
  listvalues: ListValue[];
  value: string;
  byfusioninventory: boolean;
}
