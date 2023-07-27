import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TypesApi } from 'src/app/api/types';
import { WorkflowsengineApi } from 'src/app/api/workflowsengine';
import { IType } from 'src/app/interfaces/type';
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
  selector: 'app-workflowEnginePanel',
  templateUrl: './workflowEnginePanel.component.html',
})
export class WorkflowEnginePanelComponent implements OnChanges {
  @Input() panelId: number = 0;
  @Input() panelType: string = '';
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
  public formElements: string[] = [];
  public currentGroupIndex = 0;
  public fields: IFieldsGroup = {
    type: [],
    fusioninventory: [],
  };

  public groupsProperties = [];

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
    this.workflowengineApi.updateProperty(this.workflow.id, property.id, property.value)
      .subscribe(res => {
        console.log('property updated');
      });
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
}
