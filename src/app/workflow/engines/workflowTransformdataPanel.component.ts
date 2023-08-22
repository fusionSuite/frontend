import { Component, Input, OnChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TypesApi } from 'src/app/api/types';
import { WorkflowsengineApi } from 'src/app/api/workflowsengine';
import { IWorkflowengine } from 'src/app/interfaces/workflowengine';

export interface IFields {
  key: string;
  name: string;
}

export interface IFieldsGroup {
  type: IFields[];
  fusioninventory: IFields[];
}

@Component({
  selector: 'app-workflowTransformdataPanel',
  templateUrl: './workflowTransformdataPanel.component.html',
})
export class WorkflowTransformdataPanelComponent implements OnChanges {
  @Input() panelId: number = 0;
  @Input() panelType: string = '';
  @Input() variables: any = [];
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

  public typeId = 3;
  public propertyFunction: any = [];
  public currentVariabletype = 'simple';

  public formControls = new FormGroup({
    variablename: new FormControl(null, {
      validators: [],
    }),
    function: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.ValidateFunction.bind(this)],
    }),
    value: new FormControl(null, {
      validators: [],
    }),
  });

  constructor (
    private typesApi: TypesApi,
    private workflowengineApi:WorkflowsengineApi,
  ) {
  }

  ngOnChanges (): void {
    this.loadWorkflow();
  }

  private loadWorkflow () {
    this.workflowengineApi.get(this.panelId)
      .subscribe(res => {
        this.workflow = res;
        this.propertyFunction = [];
        for (const prop of res.groups[0].properties) {
          if (prop.name === 'function') {
            this.formFunction?.setValue(prop.value);
            this.formFunction?.markAsTouched();
            this.formFunction?.updateValueAndValidity(prop.value);
            for (const allowedValue of prop.allowedvalues) {
              if (['rename', 'renameregex', 'renameregexinsensitive'].includes(allowedValue)) {
                this.propertyFunction.push({
                  value: allowedValue,
                  variabletype: 'simple',
                });
              } else {
                this.propertyFunction.push({
                  value: allowedValue,
                  variabletype: 'list',
                });
              }
            }
          } else if (prop.name === 'variablename') {
            this.formVariablename?.setValue(prop.value);
            this.calculateVariablenameProperty(prop.value);
          } else if (prop.name === 'value') {
            this.formValue?.setValue(prop.value);
          }
        }
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
    const value = this.formControls.get(property.name)?.value;
    if (value === undefined) {
      return;
    }
    if (property.name === 'variablename') {
      this.calculateVariablenameProperty(value);
      this.formFunction?.updateValueAndValidity(value);
    }

    this.workflowengineApi.updateProperty(this.workflow.id, property.id, value)
      .subscribe(res => {
        console.log('property updated');
      });
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

  private calculateVariablenameProperty (variablename: string) {
    const variableProperty = this.variables.find((item: any) => item.name === variablename);
    if (variableProperty !== undefined) {
      this.currentVariabletype = variableProperty.variabletype;
    }
  }

  public ValidateFunction (control: AbstractControl) {
    const currentFunction = this.propertyFunction.find((item: any) => item.value === control.value);
    if (currentFunction === undefined) {
      return { invalidVariabletype: true };
    } else if (currentFunction.variabletype !== this.currentVariabletype) {
      return { invalidVariabletype: true };
    }
    return null;
  }

  get formVariablename () {
    return this.formControls.get('variablename');
  }

  get formFunction () {
    return this.formControls.get('function');
  }

  get formValue () {
    return this.formControls.get('value');
  }
}
