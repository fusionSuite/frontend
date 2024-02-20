import { Component, Input, OnChanges } from '@angular/core';
import { IItemproperty } from 'src/app/interfaces/itemproperty';

@Component({
  selector: 'app-items-fields-time',
  templateUrl: './items-fields-time.component.html',
})
export class ItemsFieldsTimeComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'time',
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
