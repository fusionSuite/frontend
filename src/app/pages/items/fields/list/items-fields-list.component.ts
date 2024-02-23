import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { IItemproperty } from 'src/app/interfaces/itemproperty';

@Component({
  selector: 'app-items-fields-list',
  templateUrl: './items-fields-list.component.html',
})
export class ItemsFieldsListComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'list',
    value: null,
    unit: '',
    listvalues: null,
    default: null,
    allowedtypes: [],
  };

  @Input() editionMode: boolean = false;
  public value = {
    id: undefined,
    value: undefined,
  };

  @Output() setPropertyValueEvent = new EventEmitter<any>();
  @Output() copyToClipboard = new EventEmitter<any>();
  @Output() forceReloadItem = new EventEmitter<any>();

  public displayDescription: boolean = false;
  public showQuickAddListvalue: boolean = false;

  constructor () { }

  ngOnChanges () {
    if (this.property.value !== null) {
      this.value = this.property.value;
    }
  }

  public setValue (ev: any) {
    if (ev.id !== undefined) { 
      this.setPropertyValueEvent.emit(ev.id);
    } else if (ev === null) {
      this.setPropertyValueEvent.emit(null);
    }
  }
  
  public toClipboard (value: any) {
    this.copyToClipboard.emit(value);
  }

  public toggleDescription () {
    this.displayDescription = !this.displayDescription;
  }

  public addNew () {
    this.showQuickAddListvalue = true;
  }

  public setEmpty () {
    this.setValue(null);
  }

  public setDefault () {
    this.setValue(this.property);
    
  }

  public reload (ev: any) {
    this.forceReloadItem.emit(true);
    this.showQuickAddListvalue = false;
  }
}
