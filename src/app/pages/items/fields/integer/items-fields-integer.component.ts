import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IItemproperty } from 'src/app/interfaces/itemproperty';

@Component({
  selector: 'app-items-fields-integer',
  templateUrl: './items-fields-integer.component.html',
})
export class ItemsFieldsIntegerComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'integer',
    value: null,
    unit: '',
    listvalues: null,
    default: null,
    allowedtypes: [],
  };

  @Input() editionMode: boolean = false;
  @Output() setPropertyValueEvent = new EventEmitter<any>();
  @Output() copyToClipboard = new EventEmitter<any>();

  public formControls = new FormGroup({
    value: new FormControl(0, {
      // nonNullable: true,
      validators: [Validators.min(0), Validators.pattern('^[-]{0,1}[0-9]+$')],
    }),
  });

  constructor () { }

  ngOnChanges () {
    this.formControls.controls.value.setValue(this.property.value);
  }

  public setValue (ev: any) {
    if (this.formControls.valid && Number(this.formControls.controls.value.value) !== this.property.value) {
      this.setPropertyValueEvent.emit(Number(this.formControls.controls.value.value));
    }
  }

  public toClipboard (value: any) {
    this.copyToClipboard.emit(value);
  }
}
