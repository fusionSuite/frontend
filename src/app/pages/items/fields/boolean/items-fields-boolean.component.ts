import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IItemproperty } from 'src/app/interfaces/itemproperty';

@Component({
  selector: 'app-items-fields-boolean',
  templateUrl: './items-fields-boolean.component.html',
})
export class ItemsFieldsBooleanComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'boolean',
    value: null,
    unit: '',
    listvalues: null,
    default: null,
    allowedtypes: [],
  };

  @Input() editionMode: boolean = false;
  @Output() setPropertyValueEvent = new EventEmitter<any>();
  @Output() copyToClipboard = new EventEmitter<any>();

  public displayDescription: boolean = false;
  public formControls = new FormGroup({
    value: new FormControl(false, {
      // nonNullable: true,
      validators: [],
    }),
  });

  constructor () { }

  ngOnChanges () {
    this.formControls.controls.value.setValue(this.property.value);
  }

  public setValue () {
    if (this.formControls.valid &&
        this.formControls.controls.value.value !== this.property.value
    ) {
      this.setPropertyValueEvent.emit(this.formControls.controls.value.value);
    }
  }

  public toggleDescription () {
    this.displayDescription = !this.displayDescription;
  }

  public setDefault () {
    this.formControls.controls.value.setValue(this.property.default);
    this.setValue();
  }
}
