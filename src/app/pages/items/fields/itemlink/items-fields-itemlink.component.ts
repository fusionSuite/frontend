import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ItemsApi } from 'src/app/api/items';
import { IItem } from 'src/app/interfaces/item';
import { IItemproperty } from 'src/app/interfaces/itemproperty';
import { IShortType } from 'src/app/interfaces/short-type';

@Component({
  selector: 'app-items-fields-itemlink',
  templateUrl: './items-fields-itemlink.component.html',
})
export class ItemsFieldsItemlinkComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'itemlink',
    value: undefined,
    unit: '',
    listvalues: null,
    default: null,
    allowedtypes: [],
  };

  @Input() editionMode: boolean = false;
  @Output() setPropertyValueEvent = new EventEmitter<any>();
  @Output() copyToClipboard = new EventEmitter<any>();
  public chosenType: IShortType | null = null;
  public items: IItem[] = [];
  public value = undefined;

  constructor (
    private itemsApi: ItemsApi,
  ) { }

  ngOnChanges () {
    if (this.property.value !== null) {
      this.value = this.property.value.id;
    }
    if (this.property.allowedtypes.length === 1 && this.property.allowedtypes[0] !== this.chosenType) {
      this.chosenType = this.property.allowedtypes[0];
      this.loadItems();
    }
  }

  public loadItems () {
    if (this.property.value !== null) {
      this.items.push(this.property.value);
    }
    if (this.chosenType?.internalname !== undefined) {
      this.itemsApi.list(this.chosenType.internalname, 1, 20)
        .subscribe((result: any[]) => {
          this.items = this.items.concat(result[0]);
        });
    }
  }

  public runSearch (ev: any) {
    if (ev.term !== '' && this.chosenType?.internalname !== undefined) {
      this.itemsApi.listWithHeaders(this.chosenType.internalname, 'name_contains=' + ev.term)
        .subscribe((result: any) => {
          this.items = result.body;
        });
    }
  }

  public setType (ev: any) {
    // Todo set type
    this.loadItems();
  }

  public setValue (ev: any) {
    if (ev.id !== undefined) {
      this.setPropertyValueEvent.emit(ev.id);
    }
  }

  public toClipboard (value: any) {
    if (value.name !== undefined) {
      this.copyToClipboard.emit(value.name);
    }
  }
}
