import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { OrganizationsApi } from 'src/app/api/organizations';
import { OrganizationsSorter } from 'src/app/utils/organizations-sorter';
import { IItem } from 'src/app/interfaces/item';
import { Organization } from 'src/app/models/organization';

@Component({
  selector: 'app-organizations-list-page',
  templateUrl: './organizations-list-page.component.html',
  styleUrls: [],
})
export class OrganizationsListPageComponent implements OnInit {
  organizationsLoaded = false;
  organizations: Organization[] = [];
  organizationsByIds: {[index: number]: Organization} = {};

  deleteForm = new FormGroup({});

  constructor (
    private organizationsApi: OrganizationsApi,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit (): void {
    this.organizationsApi.list()
      .subscribe((result: IItem[]) => {
        const organizationsSorter = new OrganizationsSorter();
        const organizations = result.map((orgaItem) => new Organization(orgaItem));
        this.organizations = organizationsSorter.sort(organizations);
        this.organizationsByIds = this.indexOrganizations(this.organizations);
        this.organizationsLoaded = true;
      });
  }

  parentOrganizations (organization: Organization) {
    const parents = [];
    let parent: Organization|null = this.organizationsByIds[organization.parentId];
    while (parent != null) {
      parents.unshift(parent);
      parent = this.organizationsByIds[parent.parentId];
    }
    return parents;
  }

  deleteOrganization (organization: Organization) {
    if (!window.confirm($localize `Do you really want to delete the organization “${organization.name}”?`)) {
      return;
    }

    this.organizationsApi.delete(organization.id)
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

  indexOrganizations (organizations: Organization[]) {
    const orgasByIds: {[index: number]: Organization} = {};
    organizations.forEach((organization) => {
      orgasByIds[organization.id] = organization;
    });
    return orgasByIds;
  }
}
