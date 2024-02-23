import { Component, Input, OnChanges } from '@angular/core';
import { IItemproperty } from 'src/app/interfaces/itemproperty';

@Component({
  selector: 'app-items-fields-date',
  templateUrl: './items-fields-date.component.html',
})
export class ItemsFieldsDateComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'date',
    value: null,
    unit: '',
    listvalues: null,
    default: null,
    allowedtypes: [],
  };

  @Input() editionMode: boolean = false;

  constructor () { }

  ngOnChanges () {
    console.log('LA');
  }

  public setValue (ev: any) {

  }
}
