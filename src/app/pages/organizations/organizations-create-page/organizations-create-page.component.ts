import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { ApiService } from 'src/app/services/api.service';
import { FormStatus } from 'src/app/utils/form-status';
import { OrganizationsSorter } from 'src/app/utils/organizations-sorter';

import { IItem } from 'src/app/interfaces/item';

@Component({
  selector: 'app-organizations-create-page',
  templateUrl: './organizations-create-page.component.html',
  styleUrls: [],
})
export class OrganizationsCreatePageComponent implements OnInit {
  organizationsLoaded = false;
  organizations: IItem[] = [];

  newOrganizationForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    parentId: new FormControl('1', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  formSubmitted = false;
  formStatus: FormStatus = 'Initial';
  formError = '';

  constructor (
    private apiService: ApiService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit (): void {
    this.loadOrganizations();
  }

  loadOrganizations () {
    this.apiService.organizationList()
      .subscribe((result: IItem[]) => {
        const organizationsSorter = new OrganizationsSorter();
        this.organizations = organizationsSorter.sort(result);

        if (this.organizations.length > 0) {
          this.formControls.parentId.setValue(String(this.organizations[0].id));
        }

        this.organizationsLoaded = true;
      });
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
      parseInt(this.formControls.parentId.value, 10),
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        this.formStatus = 'Initial';
        this.formError = error.error.message;
        return throwError(() => new Error(error.error.message));
      }),
    ).subscribe((result: any) => {
      // Reset the form to its initial state
      this.formStatus = 'Initial';
      this.newOrganizationForm.reset();
      this.formSubmitted = false;
      this.notificationsService.success($localize `The organization has been created successfully.`);
      this.loadOrganizations();
    });
  }

  get formControls () {
    return this.newOrganizationForm.controls;
  }

  get canSubmit () {
    return (
      this.formStatus === 'Initial' &&
      !this.nameIsInvalid &&
      !this.parentIdIsInvalid
    );
  }

  get nameIsInvalid () {
    return this.formControls.name?.invalid && (
      this.formControls.name?.touched ||
      this.formSubmitted
    );
  }

  get parentIdIsInvalid () {
    return this.formControls.parentId?.invalid && (
      this.formControls.parentId?.touched ||
      this.formSubmitted
    );
  }

  formatOrganizationName (orga: IItem) {
    // treepath length is a multiple of 4
    const baseTreeDepth = this.organizations[0].treepath.length;
    const treeDepth = orga.treepath.length - baseTreeDepth;
    // prepend *non-breakable* spaces to the organization name
    return ' '.repeat(treeDepth) + orga.name;
  }
}
