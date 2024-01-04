import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TypesApi } from 'src/app/api/types';
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
  selector: 'app-workflowSearchitemPanel',
  templateUrl: './workflowSearchitemPanel.component.html',
})
export class WorkflowSearchitemPanelComponent implements OnChanges {
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

  public formElements: string[] = [];
  public currentGroupIndex = 0;
  public fields: IFieldsGroup = {
    type: [],
    fusioninventory: [],
  };

  public groupsProperties = [];
  public propertyFunction: any = [];
  public currentVariabletype = 'simple';
  public types: IType[] = [];
  public formControls: FormGroup[] = [];

  constructor (
    private typesApi: TypesApi,
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
        this.propertyFunction = [];
        const fieldsNames: any = {
          fieldtype: 'itemname',
          field: 'name',
          operator: '=',
          valuetype: 'value',
          value: '',
        };
        for (const group of res.groups) {
          for (const prop of group.properties) {
            fieldsNames[prop.name] = prop.value;
          }
          const formGroup = new FormGroup({
            fieldtype: new FormControl(fieldsNames.fieldtype, {
              validators: [],
            }),
            field: new FormControl(fieldsNames.field, {
              validators: [],
            }),
            operator: new FormControl(fieldsNames.operator, {
              validators: [],
            }),
            valuetype: new FormControl(fieldsNames.valuetype, {
              validators: [],
            }),
            value: new FormControl(fieldsNames.value, {
              validators: [],
            }),
          });
          this.formControls.push(formGroup);
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

  public getPropertiesOfType () {
    const type = this.types.find((type: IType) => type.id === this.typeId);
    if (type === undefined) {
      return [];
    }
    return type.properties;
  }

  public updateProperty (property: any) {
    if (this.formControls[this.currentGroupIndex].get(property.name)) {
      this.workflowengineApi.updateProperty(this.workflow.id, property.id, this.formControls[this.currentGroupIndex].get(property.name)?.value)
        .subscribe(res => {
          console.log('property updated');
        });
    }
  }

  public isFieldtypeItemname () {
    const fieldtype = this.workflow.groups[this.currentGroupIndex].properties.find((item: any) => item.name === 'fieldtype');
    if (fieldtype === undefined) {
      return false;
    }
    if (fieldtype.value === 'itemname') {
      return true;
    }
    return false;
  }

  public addGroup () {
    this.workflowengineApi.addGroup(this.workflow.id)
      .subscribe(res => {
        this.loadWorkflow();
      });
  }

  public deleteGroup (groupId: number) {
    this.workflowengineApi.deleteGroup(this.workflow.id, groupId)
      .subscribe(res => {
        this.loadWorkflow();
      });
  }

  public nextGroup () {
    this.currentGroupIndex++;
  }

  public previousGroup () {
    this.currentGroupIndex--;
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
    const variableProperty = this.variables.find((item:any) => item.name === variablename);
    if (variableProperty !== undefined) {
      this.currentVariabletype = variableProperty.variabletype;
    }
  }
}
