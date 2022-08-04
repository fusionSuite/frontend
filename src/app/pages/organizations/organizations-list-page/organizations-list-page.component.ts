import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { ApiService } from 'src/app/services/api.service';
import { OrganizationsSorter } from 'src/app/utils/organizations-sorter';

import { IItem } from 'src/app/interfaces/item';

@Component({
  selector: 'app-organizations-list-page',
  templateUrl: './organizations-list-page.component.html',
  styleUrls: [],
})
export class OrganizationsListPageComponent implements OnInit {
  organizationsLoaded = false;
  organizations: IItem[] = [];
  organizationsByIds: {[index: number]: IItem} = {};

  deleteForm = new FormGroup({});

  constructor (
    private apiService: ApiService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit (): void {
    this.apiService.organizationList()
      .subscribe((result: IItem[]) => {
        const organizationsSorter = new OrganizationsSorter();
        this.organizations = organizationsSorter.sort(result);
        this.organizationsByIds = this.indexOrganizations(this.organizations);
        this.organizationsLoaded = true;
      });
  }

  parentOrganizations (organization: IItem) {
    const parents = [];
    let parentId: number|null = organization.parent_id;
    while (parentId != null) {
      const parent: IItem|null = this.organizationsByIds[parentId];
      if (parent) {
        parents.unshift(parent);
        parentId = parent.parent_id;
      } else {
        parentId = null;
      }
    }
    return parents;
  }

  deleteOrganization (organization: IItem) {
    if (!window.confirm($localize `Do you really want to delete the organization “${organization.name}”?`)) {
      return;
    }

    this.apiService.organizationDelete(organization.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        // Filter the list of organizations to remove the deleted organization
        // and its children.
        this.organizations = this.organizations.filter((orga) => {
          const parentOrgas = this.parentOrganizations(orga);
          const isChild = parentOrgas.some((parentOrga) => {
            return parentOrga.id === organization.id;
          });
          return orga.id !== organization.id && !isChild;
        });
        this.organizationsByIds = this.indexOrganizations(this.organizations);

        this.notificationsService.success($localize `The organization has been deleted successfully.`);
      });
  }

  indexOrganizations (organizations: IItem[]) {
    const orgasByIds: {[index: number]: IItem} = {};
    organizations.forEach((organization) => {
      orgasByIds[organization.id] = organization;
    });
    return orgasByIds;
  }
}
