import { Component, Input } from '@angular/core';
import { WorkflowsactionApi } from 'src/app/api/workflowsaction';

@Component({
  templateUrl: './workflowAction.component.html',
})
export class WorkflowActionComponent {
  @Input() data: any;
  @Input() testingData: any;
  public field: string = '';
  public value: string = '';

  constructor (
    private workflowactionApi:WorkflowsactionApi,
  ) {}
}
