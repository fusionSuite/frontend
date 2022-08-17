import { IItem } from 'src/app/interfaces/item';
import { IProperty } from 'src/app/interfaces/property';

export class Item {
  item: IItem;

  name: string;
  propertiesIndexedByInternalname: {[key: string]: IProperty} = {};

  constructor (item: IItem) {
    this.item = item;
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
