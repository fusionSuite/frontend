import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { WorkflowsactionApi } from 'src/app/api/workflowsaction';

@Component({
  templateUrl: './workflowAction.component.html',
})
export class WorkflowActionComponent {
  @Input() data: any;
  public field: string = '';
  public value: string = '';

  constructor (
    private workflowactionApi:WorkflowsactionApi,
  ) {}

  public addDefinition () {
    if (this.data.subtype === 'Go to another type (FusionInventory)') {
      this.field = 'type';
    }
    this.workflowactionApi.createDefinition(this.data.id, this.field, this.value)
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
