import { Component, Input, OnChanges } from '@angular/core';
import { TypesApi } from 'src/app/api/types';
import { WorkflowsactionApi } from 'src/app/api/workflowsaction';
import { IType } from 'src/app/interfaces/type';
import { IWorkflowaction } from 'src/app/interfaces/workflowaction';
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
  selector: 'app-workflowActionPanel',
  templateUrl: './workflowActionPanel.component.html',
})
export class WorkflowActionPanelComponent implements OnChanges {
  @Input() panelId: number = 0;
  @Input() panelType: string = '';
  @Input() typeId: number = 0;

  public formElements: string[] = [];
  public types: IType[] = [];
  public currentGroupIndex = 0;
  public fields: IFieldsGroup = {
    type: [],
    fusioninventory: [],
  };

  @Input() workflow: IWorkflowaction = {
    id: 0,
    name: '',
    category: 'createitem',
    x: 0,
    y: 0,
    comment: '',
    multiplegroups: false,
    groups: [],
    children: [],
    children_error: [],
  };

  constructor (
    private typesApi: TypesApi,
    private workflowactionApi: WorkflowsactionApi,
    protected settingsService: SettingsService,
  ) {
  }

  ngOnChanges (): void {
    this.types = this.settingsService.getAllTypes();
    this.loadWorkflow();
  }

  private loadWorkflow () {
    this.workflowactionApi.get(this.panelId)
      .subscribe(res => {
        this.workflow = res;
      });
  }

  public updateField (event: any) {
    const name = event.target;
    if (name !== null && name.value !== this.workflow.name) {
      this.workflowactionApi.update(this.workflow.id, { name: name.value })
        .subscribe(res => {
          console.log('updated');
        });
    }
  }

  public updateProperty (property: any) {
    this.workflowactionApi.updateProperty(this.workflow.id, property.id, property.value)
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

  public getPropertiesOfType () {
    const type = this.types.find((type: IType) => type.id === this.typeId);
    if (type === undefined) {
      return [];
    }
    return type.properties;
  }

  public addGroup () {
    this.workflowactionApi.addGroup(this.workflow.id)
      .subscribe(res => {
        this.loadWorkflow();
      });
  }

  public deleteGroup (groupId: number) {
    this.workflowactionApi.deleteGroup(this.workflow.id, groupId)
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
}
