import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { IItemproperty } from 'src/app/interfaces/itemproperty';

@Component({
  selector: 'app-items-fields-string',
  templateUrl: './items-fields-string.component.html',
})
export class ItemsFieldsStringComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'string',
    value: null,
    unit: '',
    listvalues: null,
    default: null,
    allowedtypes: [],
  };

  @Input() editionMode: boolean = false;
  @Output() setPropertyValueEvent = new EventEmitter<any>();
  @Output() copyToClipboard = new EventEmitter<any>();

  constructor () { }

  ngOnChanges () {
  }

  public setValue (ev: any) {
    if (ev.target.value !== undefined && ev !== '') {
      this.setPropertyValueEvent.emit(ev.target.value);
    }
  }

  public toClipboard (value: any) {
    this.copyToClipboard.emit(value);
  }
}
