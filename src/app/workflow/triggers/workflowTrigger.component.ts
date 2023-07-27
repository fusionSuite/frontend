import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { WorkflowstriggerApi } from 'src/app/api/workflowstrigger';

@Component({
  templateUrl: './workflowTrigger.component.html',
})
export class WorkflowTriggerComponent {
  @Input() data: any;

  constructor (
    private workflowtriggerApi:WorkflowstriggerApi,
  ) {}

  public toggleSync () {
    this.data.async = !this.data.async;
    const async = this.data.itemBackend.properties.find((item: any) => item.name === 'async');
    if (async !== null) {
      this.workflowtriggerApi.updateProperty(this.data.id, async.id, this.data.async)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            // this.notificationsService.error(error.error.message);
            return throwError(() => new Error(error.error.message));
          }),
        ).subscribe((result: any) => {
          // Reset the form to its initial state
          // this.notificationsService.success($localize `The item has been updated successfully.`);
        });
    }
  }
}
