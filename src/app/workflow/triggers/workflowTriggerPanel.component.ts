import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TypesApi } from 'src/app/api/types';
import { WorkflowstriggerApi } from 'src/app/api/workflowstrigger';

@Component({
  selector: 'app-workflowTriggerPanel',
  templateUrl: './workflowTriggerPanel.component.html',
})
export class WorkflowTriggerPanelComponent implements OnChanges {
  @Input() panelId: number = 0;
  @Input() panelType: string = '';

  @Output() changeTriggerData = new EventEmitter<any>();

  public typeId = 3;
  public formElements: string[] = [];
  public async: boolean = false;

  constructor (
    private typesApi: TypesApi,
    private workflowtriggerApi: WorkflowstriggerApi,
  ) {
  }

  ngOnChanges (): void {
    if (this.panelId > 0) {
      this.workflowtriggerApi.get(this.panelId)
        .subscribe((res) => {
          // this.async = res.async;
        });
    }
  }

  // when update in DB, emit
  //     this.changeTriggerData.emit(data);
}
