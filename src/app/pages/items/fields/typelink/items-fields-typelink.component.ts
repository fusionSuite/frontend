import { Component, Input, OnChanges } from '@angular/core';
import { IItemproperty } from 'src/app/interfaces/itemproperty';
import { IShortType } from 'src/app/interfaces/short-type';

@Component({
  selector: 'app-items-fields-typelink',
  templateUrl: './items-fields-typelink.component.html',
})
export class ItemsFieldsTypelinkComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'typelink',
    value: null,
    unit: '',
    listvalues: null,
    default: null,
    allowedtypes: [],
  };

  @Input() editionMode: boolean = false;
  public chosenType: IShortType | null = null;

  constructor () { }

  ngOnChanges () {
    if (this.property.allowedtypes.length === 1) {
      this.chosenType = this.property.allowedtypes[0];
    }
  }

  public loadItems () {
    // TODO
    // manage when have only 1 allowedtypes
    // manage when have multiple allowedtypes, to have a first select to select the type required

  }

  public setType (ev: any) {

  }

  public setValue (ev: any) {

  }
}
