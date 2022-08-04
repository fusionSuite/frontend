import { Component, OnInit } from '@angular/core';

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

  constructor (
    private apiService: ApiService,
  ) { }

  ngOnInit (): void {
    this.apiService.organizationList()
      .subscribe((result: IItem[]) => {
        const organizationsSorter = new OrganizationsSorter();
        this.organizations = organizationsSorter.sort(result);

        result.forEach((organization) => {
          this.organizationsByIds[organization.id] = organization;
        });

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
}
