import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiService } from 'src/app/services/api.service';
import { FormStatus } from 'src/app/utils/form-status';

@Component({
  selector: 'app-organizations-create-page',
  templateUrl: './organizations-create-page.component.html',
  styleUrls: ['./organizations-create-page.component.scss'],
})
export class OrganizationsCreatePageComponent implements OnInit {
  newOrganizationForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  formSubmitted = false;
  formStatus: FormStatus = 'Initial';
  formError = '';

  constructor (
    private apiService: ApiService,
  ) { }

  ngOnInit (): void {
  }

  onFormSubmit () {
    this.formSubmitted = true;

    if (!this.canSubmit) {
      return;
    }

    this.formStatus = 'Pending';
    this.formError = '';

    this.apiService.organizationCreate(
      this.formControls.name.value,
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        this.formStatus = 'Initial';
        this.formError = error.error.message;
        return throwError(() => new Error(error.error.message));
      }),
    )
      .subscribe((result: any) => {
        // Reset the form to its initial state
        this.formStatus = 'Initial';
        this.newOrganizationForm.reset();
        this.formSubmitted = false;
      });
  }

  get formControls () {
    return this.newOrganizationForm.controls;
  }

  get canSubmit () {
    return (
      this.formStatus === 'Initial' &&
      !this.nameIsInvalid
    );
  }

  get nameIsInvalid () {
    return this.formControls.name?.invalid && (
      this.formControls.name?.touched ||
      this.formSubmitted
    );
  }
}
