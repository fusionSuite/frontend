/**
 * FusionSuite - Frontend
 * Copyright (C) 2022 FusionSuite
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { TicketsApi } from 'src/app/api/tickets';
import { UsersApi } from 'src/app/api/users';
import { FormStatus } from 'src/app/utils/form-status';
import { IItem } from 'src/app/interfaces/item';
import { User } from 'src/app/models/user';
import { buildEditorConfiguration } from 'src/app/utils/tinycme-editor-configuration';

@Component({
  selector: 'app-tickets-create-page',
  templateUrl: './tickets-create-page.component.html',
  styleUrls: [],
})
export class TicketsCreatePageComponent implements OnInit {
  newTicketForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    status: new FormControl('New', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    requesterId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    assigneeId: new FormControl('', {
      nonNullable: true,
    }),
  });

  editorConfiguration = buildEditorConfiguration($localize `Description (Rich Text Area)`);

  formSubmitted = false;
  formStatus: FormStatus = 'Initial';
  formError = '';

  usersLoaded = false;
  users: User[] = [];

  constructor (
    private ticketsApi: TicketsApi,
    private usersApi: UsersApi,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit (): void {
    this.loadUsers();
  }

  loadUsers () {
    this.usersApi.list()
      .subscribe((result: IItem[]) => {
        this.users = result.map((userItem) => new User(userItem));
        this.users.sort((u1, u2) => u1.name.localeCompare(u2.name));
        this.usersLoaded = true;
      });
  }

  onFormSubmit () {
    this.formSubmitted = true;

    if (!this.canSubmit) {
      return;
    }

    this.formStatus = 'Pending';
    this.formError = '';

    const assigneeId = this.formControls.assigneeId.value;

    this.ticketsApi.create(
      this.formControls.name.value,
      this.formControls.description.value,
      this.formControls.status.value,
      parseInt(this.formControls.requesterId.value, 10),
      assigneeId !== '' ? parseInt(assigneeId, 10) : null,
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        this.formStatus = 'Initial';
        this.formError = error.error.message;
        return throwError(() => new Error(error.error.message));
      }),
    ).subscribe((result: any) => {
      // Reset the form to its initial state
      this.formStatus = 'Initial';
      this.newTicketForm.reset();
      this.formSubmitted = false;
      this.notificationsService.success($localize `The ticket has been created successfully.`);
    });
  }

  handleAssigneeChange () {
    const status = this.formControls.status.value;
    const assigneeId = this.formControls.assigneeId.value;
    if (status === 'New' && assigneeId !== '') {
      this.formControls.status.setValue('Assigned');
    } else if (status === 'Assigned' && assigneeId === '') {
      this.formControls.status.setValue('New');
    }
  }

  get formControls () {
    return this.newTicketForm.controls;
  }

  get canSubmit () {
    return (
      this.formStatus === 'Initial' &&
      !this.nameIsInvalid &&
      !this.descriptionIsInvalid &&
      !this.statusIsInvalid &&
      !this.requesterIdIsInvalid &&
      !this.assigneeIdIsInvalid
    );
  }

  get nameIsInvalid () {
    return this.formControls.name?.invalid && (
      this.formControls.name?.touched ||
      this.formSubmitted
    );
  }

  get descriptionIsInvalid () {
    return this.formControls.description?.invalid && (
      this.formControls.description?.touched ||
      this.formSubmitted
    );
  }

  get statusIsInvalid () {
    return this.formControls.status?.invalid && (
      this.formControls.status?.touched ||
      this.formSubmitted
    );
  }

  get requesterIdIsInvalid () {
    return this.formControls.requesterId?.invalid && (
      this.formControls.requesterId?.touched ||
      this.formSubmitted
    );
  }

  get assigneeIdIsInvalid () {
    return this.formControls.assigneeId?.invalid && (
      this.formControls.assigneeId?.touched ||
      this.formSubmitted
    );
  }
}
