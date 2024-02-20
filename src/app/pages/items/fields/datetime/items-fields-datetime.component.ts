import { Component, Input, OnChanges } from '@angular/core';
import { IItemproperty } from 'src/app/interfaces/itemproperty';

@Component({
  selector: 'app-items-fields-datetime',
  templateUrl: './items-fields-datetime.component.html',
})
export class ItemsFieldsDatetimeComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'datetime',
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
