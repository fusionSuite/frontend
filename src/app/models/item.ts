import { IItem } from 'src/app/interfaces/item';
import { IProperty } from 'src/app/interfaces/property';

export class Item {
  item: IItem;

  id: number;
  name: string;
  indexedProperties: {[key: string]: IProperty} = {};

  constructor (item: IItem) {
    this.item = item;
    this.id = item.id;
    this.name = item.name;
    this.item.properties.forEach((property) => {
      this.indexedProperties[property.internalname] = property;
    });
  }

  propValue (internalname: string, defaultValue: any = null) {
    if (this.indexedProperties[internalname]) {
      return this.indexedProperties[internalname].value;
    } else {
      return defaultValue;
    }
  }

  get organizationName () {
    return this.item.organization.name;
  }
}
