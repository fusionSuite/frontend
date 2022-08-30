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

import { Organization } from 'src/app/models/organization';

@Component({
  selector: 'app-users-create-page',
  templateUrl: './users-create-page.component.html',
  styleUrls: [],
})
export class UsersCreatePageComponent implements OnInit {
  organizationsLoaded = false;
  organizations: Organization[] = [];

  newUserForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    firstname: new FormControl('', {
      nonNullable: true,
    }),

    lastname: new FormControl('', {
      nonNullable: true,
    }),

    organizationId: new FormControl('1', {
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
        const organizations = result.map((orgaItem) => new Organization(orgaItem));
        this.organizations = organizationsSorter.sort(organizations);

        if (this.organizations.length > 0) {
          this.formControls.organizationId.setValue(String(this.organizations[0].id));
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

    this.apiService.userCreate(
      this.formControls.name.value,
      this.formControls.firstname.value,
      this.formControls.lastname.value,
      parseInt(this.formControls.organizationId.value, 10),
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        this.formStatus = 'Initial';
        this.formError = error.error.message;
        return throwError(() => new Error(error.error.message));
      }),
    ).subscribe((result: any) => {
      // Reset the form to its initial state
      this.formStatus = 'Initial';
      this.newUserForm.reset();
      this.formSubmitted = false;
      this.notificationsService.success($localize `The user has been created successfully.`);
    });
  }

  get formControls () {
    return this.newUserForm.controls;
  }

  get canSubmit () {
    return (
      this.formStatus === 'Initial' &&
      !this.nameIsInvalid &&
      !this.organizationIdIsInvalid
    );
  }

  get nameIsInvalid () {
    return this.formControls.name?.invalid && (
      this.formControls.name?.touched ||
      this.formSubmitted
    );
  }

  get organizationIdIsInvalid () {
    return this.formControls.organizationId?.invalid && (
      this.formControls.organizationId?.touched ||
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

  fillUsername () {
    const firstname = this.formControls.firstname.value.toLocaleLowerCase();
    const lastname = this.formControls.lastname.value.toLocaleLowerCase();
    const username = (firstname + ' ' + lastname).trim().replace(' ', '-');
    this.formControls.name.setValue(username);
  }
}
