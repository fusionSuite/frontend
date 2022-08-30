import { IItem } from 'src/app/interfaces/item';
import { IProperty } from 'src/app/interfaces/property';

export class Item {
  item: IItem;

  id: number;
  parentId: number;
  treepath: string;
  name: string;
  propertiesIndexedByInternalname: {[key: string]: IProperty} = {};

  constructor (item: IItem) {
    this.item = item;
    this.id = item.id;
    this.parentId = item.parent_id != null ? item.parent_id : -1;
    this.treepath = item.treepath != null ? item.treepath : '';
    this.name = item.name;
    this.item.properties.forEach((property) => {
      this.propertiesIndexedByInternalname[property.internalname] = property;
    });
  }

  getPropValueByInternalname (internalname: string, defaultValue: any = null) {
    if (this.propertiesIndexedByInternalname[internalname]) {
      return this.propertiesIndexedByInternalname[internalname].value;
    } else {
      return defaultValue;
    }
  }

  get organizationName () {
    return this.item.organization.name;
  }
}
