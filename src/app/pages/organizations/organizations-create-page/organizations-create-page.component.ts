import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { OrganizationsApi } from 'src/app/api/organizations';
import { FormStatus } from 'src/app/utils/form-status';
import { OrganizationsSorter } from 'src/app/utils/organizations-sorter';
import { IItem } from 'src/app/interfaces/item';
import { Organization } from 'src/app/models/organization';

@Component({
  selector: 'app-organizations-create-page',
  templateUrl: './organizations-create-page.component.html',
  styleUrls: [],
})
export class OrganizationsCreatePageComponent implements OnInit {
  organizationsLoaded = false;
  organizations: Organization[] = [];

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
    private organizationsApi: OrganizationsApi,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit (): void {
    this.loadOrganizations();
  }

  loadOrganizations () {
    this.organizationsApi.list()
      .subscribe((result: IItem[]) => {
        const organizationsSorter = new OrganizationsSorter();
        const organizations = result.map((orgaItem) => new Organization(orgaItem));
        this.organizations = organizationsSorter.sort(organizations);

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

    this.organizationsApi.create(
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

  get baseOrganizationNameIndentation () {
    if (this.organizations[0] != null) {
      return this.organizations[0].treepath.length;
    } else {
      return 0;
    }
  }
}
