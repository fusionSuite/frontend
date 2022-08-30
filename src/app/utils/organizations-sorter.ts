import { Organization } from 'src/app/models/organization';

export class OrganizationsSorter {
  sort (organizations: Organization[]): Organization[] {
    if (!organizations) {
      return [];
    }

    const orgasIds: number[] = [];
    const orgasByParentId: {[index: number]: Organization[]} = {};

    // Initialize the lookup objects to find organizations and their children
    // easily.
    organizations.forEach((orga) => {
      orgasIds.push(orga.id);

      if (orgasByParentId[orga.parentId] == null) {
        orgasByParentId[orga.parentId] = [];
      }

      orgasByParentId[orga.parentId].push(orga);
    });

    // Get the root organization id. We first get the list of potential parent
    // organizations (i.e. keys of orgasByParentId). Then we get the one that
    // doesn't exist in the list of organizations (i.e. orgasIds). It is
    // either:
    // - the id "-1" which corresponds to parent_id == null;
    // - another id whose organization wasn't returned by the server because of
    //   right accesses.
    const rootId = Object.keys(orgasByParentId).find((id) => {
      return !orgasIds.includes(parseInt(id, 10));
    });

    if (rootId == null) {
      return [];
    }

    return this.getChildrenOrganizationsOf(orgasByParentId, parseInt(rootId, 10));
  }

  getChildrenOrganizationsOf (orgasByParentId: {[index: number]: Organization[]}, orgaId: number): Organization[] {
    let sortedOrganizations: Organization[] = [];
    const childrenOrganizations = orgasByParentId[orgaId];

    if (childrenOrganizations == null) {
      return [];
    }

    // First, sort children organizations by name
    childrenOrganizations.sort((o1: Organization, o2: Organization) => {
      return o1.name.localeCompare(o2.name);
    });

    // Then add the orga one by one with their own children organizations
    childrenOrganizations.forEach((orga: Organization) => {
      sortedOrganizations = [
        ...sortedOrganizations,
        orga,
        ...this.getChildrenOrganizationsOf(orgasByParentId, orga.id),
      ];
    });

    return sortedOrganizations;
  }
}
