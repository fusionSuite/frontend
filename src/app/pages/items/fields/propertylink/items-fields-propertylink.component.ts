import { Component, Input, OnChanges } from '@angular/core';
import { ItemsApi } from 'src/app/api/items';
import { IItem } from 'src/app/interfaces/item';
import { IItemproperty } from 'src/app/interfaces/itemproperty';
import { IShortType } from 'src/app/interfaces/short-type';

@Component({
  selector: 'app-items-fields-propertylink',
  templateUrl: './items-fields-propertylink.component.html',
})
export class ItemsFieldsPropertylinkComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'propertylink',
    value: null,
    unit: '',
    listvalues: null,
    default: null,
    allowedtypes: [],
  };

  @Input() editionMode: boolean = false;
  public chosenType: IShortType | null = null;
  public items: IItem[] = [];

  constructor (
    private itemsApi: ItemsApi,
  ) { }

  ngOnChanges () {
    if (this.property.allowedtypes.length === 1) {
      this.chosenType = this.property.allowedtypes[0];
      this.loadItems();
    }
  }

  public loadItems () {
    if (this.chosenType?.internalname !== undefined) {
      this.itemsApi.list(this.chosenType.internalname, 1)
        .subscribe((result: any[]) => {
          this.items = result[0];
          // let all: IItem[] = [];
          // if pages === 1
          // put data
          // else if pages > 1
          // dynamic load / search

          // for (let page = 0; page < result.length; page++) {
          //   all = all.concat(result[page]);
          // }
          // this.selectItems[typeInternalname] = all;
        });
    }
  }

  public setType (ev: any) {
    // TOdo set type
    this.loadItems();
  }

  public setValue (ev: any) {

  }
}
