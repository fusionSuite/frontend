import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { WorkflowsengineApi } from 'src/app/api/workflowsengine';
import { IType } from 'src/app/interfaces/type';
import { IWorkflowengine } from 'src/app/interfaces/workflowengine';
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
  selector: 'app-workflowCheckcriteriaPanel',
  templateUrl: './workflowCheckcriteriaPanel.component.html',
})
export class WorkflowCheckcriteriaPanelComponent implements OnChanges {
  @Input() panelId: number = 0;
  @Input() panelType: string = '';
  @Input() variables: any = [];
  @Input() typeId: number = 0;
  @Input() workflow: IWorkflowengine = {
    id: 0,
    name: '',
    category: 'checkcriteria',
    x: 0,
    y: 0,
    comment: '',
    multiplegroups: false,
    groups: [],
    children: [],
    children_error: [],
    variable: null,
  };

  public types: IType[] = [];
  public formControls = new FormGroup({
    fieldtype: new FormControl('simple', {
      validators: [],
    }),
    field: new FormControl('name', {
      validators: [],
    }),
    operator: new FormControl('=', {
      validators: [],
    }),
    valuetype: new FormControl('simple', {
      validators: [],
    }),
    value: new FormControl('', {
      validators: [],
    }),
  }, { validators: this.globalFormValidator.bind(this) });

  constructor (
    private workflowengineApi:WorkflowsengineApi,
    protected settingsService: SettingsService,
  ) {
  }

  ngOnChanges (): void {
    this.loadWorkflow();
    this.types = this.settingsService.getAllTypes();
  }

  private loadWorkflow () {
    this.workflowengineApi.get(this.panelId)
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
      this.workflowengineApi.update(this.workflow.id, { name: name.value })
        .subscribe(res => {
          console.log('updated');
        });
    }
  }

  public updateProperty (property: any) {
    if (this.formControls.get(property.name)) {
      this.workflowengineApi.updateProperty(this.workflow.id, property.id, this.formControls.get(property.name)?.value)
        .subscribe(res => {
          console.log('property updated');
        });
    }
  }

  public updateVariable (value: string, key: string) {
    if (key === 'name' && this.workflow.variable !== null) {
      value = this.workflow.variable.name;
    }
    this.workflowengineApi.updateVariable(this.workflow.id, { [key]: value })
      .subscribe(res => {
        console.log('variable updated');
      });
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
