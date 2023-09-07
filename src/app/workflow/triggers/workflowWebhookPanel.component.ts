import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { WorkflowstriggerApi } from 'src/app/api/workflowstrigger';
import { IType } from 'src/app/interfaces/type';
import { IWorkflowtrigger } from 'src/app/interfaces/workflowtrigger';
import { SettingsService } from 'src/app/services/settings.service';

export interface IFields {
  key: string;
  name: string;
}

export interface IFieldsGroup {
  type: IFields[];
  fusioninventory: IFields[];
}

@Component({
  selector: 'app-workflowWebhookPanel',
  templateUrl: './workflowWebhookPanel.component.html',
})
export class WorkflowWebhookPanelComponent implements OnChanges {
  @Input() panelId: number = 0;
  @Input() panelType: string = '';
  @Input() variables: any = [];
  @Input() typeId: number = 0;
  @Input() workflow: IWorkflowtrigger = {
    id: 0,
    name: '',
    category: 'webhook',
    x: 0,
    y: 0,
    comment: '',
    multiplegroups: false,
    groups: [],
    children: [],
  };

  public types: IType[] = [];
  public formControls = new FormGroup({
    async: new FormControl(false, {
      validators: [],
    }),
    endpoint: new FormControl('', {
      validators: [],
    }),
    username: new FormControl('', {
      validators: [],
    }),
    password: new FormControl('', {
      validators: [],
    }),
    iprestriction: new FormControl('', {
      validators: [],
    }),
  }, { validators: this.globalFormValidator.bind(this) });

  public numbers = Array(500).fill(1).map((x, i) => i + 1);

  constructor (
    private workflowtriggerApi:WorkflowstriggerApi,
    protected settingsService: SettingsService,
  ) {
  }

  ngOnChanges (): void {
    this.loadWorkflow();
    this.types = this.settingsService.getAllTypes();
  }

  private loadWorkflow () {
    this.workflowtriggerApi.get(this.panelId)
      .subscribe(res => {
        this.workflow = res;
        for (const prop of res.groups[0].properties) {
          this.formControls.get(prop.name)?.setValue(prop.value);
        }
        this.formField?.markAsTouched();
        this.formValue?.markAsTouched();
        this.formControls?.updateValueAndValidity();
      });
  }

  public updateField (event: any) {
    const name = event.target;
    if (name !== null && name.value !== this.workflow.name) {
      this.workflowtriggerApi.update(this.workflow.id, { name: name.value })
        .subscribe(res => {
          console.log('updated');
        });
    }
  }

  public updateProperty (property: any) {
    if (this.formControls.get(property.name)) {
      this.workflowtriggerApi.updateProperty(this.workflow.id, property.id, this.formControls.get(property.name)?.value)
        .subscribe(res => {
          console.log('property updated');
        });
    }
  }

  public getPropertiesOfType () {
    const type = this.types.find((type: IType) => type.id === this.typeId);
    if (type === undefined) {
      return [];
    }
    return type.properties;
  }

  get formFieldtype () {
    return this.formControls.get('fieldtype');
  }

  get formField () {
    return this.formControls.get('field');
  }

  get formOperator () {
    return this.formControls.get('operator');
  }

  get formValuetype () {
    return this.formControls.get('valuetype');
  }

  get formValue () {
    return this.formControls.get('value');
  }

  public globalFormValidator (control: AbstractControl) {
    const validator = {
      notFoundVariablenameField: false,
      notFoundVariablenameValue: false,
    };
    let isValidate = true;
    const fieldtype = control.get('fieldtype');
    const field = control.get('field');
    const valuetype = control.get('valuetype');
    const value = control.get('value');

    if (fieldtype && field && fieldtype.value === 'variable') {
      const variable = this.variables.find((item: any) => item.name === field);
      if (variable === undefined) {
        validator.notFoundVariablenameField = true;
        isValidate = false;
        field.setErrors({ notFoundVariablenameField: true });
      }
    }

    if (valuetype && value && valuetype.value === 'variable') {
      const variable = this.variables.find((item: any) => item.name === value);
      if (variable === undefined) {
        validator.notFoundVariablenameValue = true;
        isValidate = false;
        value.setErrors({ notFoundVariablenameValue: true });
      }
    }

    if (isValidate) {
      return null;
    }
    return validator;
  }
}
