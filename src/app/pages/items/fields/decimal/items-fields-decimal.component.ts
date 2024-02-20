import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IItemproperty } from 'src/app/interfaces/itemproperty';

@Component({
  selector: 'app-items-fields-decimal',
  templateUrl: './items-fields-decimal.component.html',
})
export class ItemsFieldsDecimalComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'decimal',
    value: null,
    unit: '',
    listvalues: null,
    default: null,
    allowedtypes: [],
    description: null,
  };

  @Input() editionMode: boolean = false;
  @Output() setPropertyValueEvent = new EventEmitter<any>();
  @Output() copyToClipboard = new EventEmitter<any>();

  public displayDescription: boolean = false;
  public formControls = new FormGroup({
    value: new FormControl(0, {
      // nonNullable: true,
      validators: [Validators.min(0), Validators.pattern('^[-]{0,1}[0-9]+\.[0-9]+$')],
    }),
  });

  constructor () { }

  ngOnChanges () {
    this.formControls.controls.value.setValue(this.property.value);
  }

  public setValue () {
    if (this.formControls.valid &&
        this.formControls.controls.value.value !== null &&
        Number(this.formControls.controls.value.value) !== this.property.value
    ) {
      this.setPropertyValueEvent.emit(Number(this.formControls.controls.value.value));
    } else if (this.formControls.valid &&
        this.formControls.controls.value.value === null &&
        this.formControls.valid !== null
    ) {
      this.setPropertyValueEvent.emit(null);
    }
  }

  public toClipboard (value: any) {
    this.copyToClipboard.emit(value);
  }

  public toggleDescription () {
    this.displayDescription = !this.displayDescription;
  }

  public setEmpty () {
    this.formControls.controls.value.setValue(null);
    this.setValue();
  }

  public setDefault () {
    this.formControls.controls.value.setValue(this.property.default);
    this.setValue();
  }
}
