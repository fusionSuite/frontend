import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { WorkflowsengineApi } from 'src/app/api/workflowsengine';

@Component({
  templateUrl: './workflowEngine.component.html',
})
export class WorkflowEngineComponent {
  @Input() data: any;

  constructor (
    private workflowengineApi:WorkflowsengineApi,
  ) {}

  public updateQuery () {
    this.workflowengineApi.update(this.data.id, { query: this.data.query })
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
