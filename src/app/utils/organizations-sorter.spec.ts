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

import { OrganizationsSorter } from './organizations-sorter';
import { Organization } from 'src/app/models/organization';

function buildOrganization (id: number, name: string, parentId: number|null): Organization {
  return new Organization({
    id,
    id_bytype: id,
    name,
    parent_id: parentId,
    treepath: '0001',
    organization: {
      id,
      name,
    },
    properties: [],
  });
}

describe('OrganizationsSorter', () => {
  const organizationsSorter = new OrganizationsSorter();

  it('sorts child organizations by name', () => {
    const sortedOrganizations = organizationsSorter.sort([
      buildOrganization(2, 'Probesys', 1),
      buildOrganization(3, 'DCS EASYWARE', 1),
      buildOrganization(1, 'My organization', null),
    ]);

    expect(sortedOrganizations[0].name).toEqual('My organization');
    expect(sortedOrganizations[1].name).toEqual('DCS EASYWARE');
    expect(sortedOrganizations[2].name).toEqual('Probesys');
  });

  it('groups child organizations by parents', () => {
    const sortedOrganizations = organizationsSorter.sort([
      buildOrganization(1, 'My organization', null),
      buildOrganization(2, 'Probesys', 1),
      buildOrganization(3, 'DCS EASYWARE', 1),
      buildOrganization(4, 'Web division', 2),
      buildOrganization(5, 'Network division', 2),
    ]);

    expect(sortedOrganizations[0].name).toEqual('My organization');
    expect(sortedOrganizations[1].name).toEqual('DCS EASYWARE');
    expect(sortedOrganizations[2].name).toEqual('Probesys');
    expect(sortedOrganizations[3].name).toEqual('Network division');
    expect(sortedOrganizations[4].name).toEqual('Web division');
  });

  it('works when root organization doesn’t exist', () => {
    const sortedOrganizations = organizationsSorter.sort([
      buildOrganization(2, 'Probesys', 1),
      buildOrganization(4, 'Web division', 2),
      buildOrganization(5, 'Network division', 2),
    ]);

    expect(sortedOrganizations[0].name).toEqual('Probesys');
    expect(sortedOrganizations[1].name).toEqual('Network division');
    expect(sortedOrganizations[2].name).toEqual('Web division');
  });

  it('works with an empty list', () => {
    const sortedOrganizations = organizationsSorter.sort([]);

    expect(sortedOrganizations.length).toEqual(0);
  });

  it('takes only one root organization if several exist', () => {
    // This case should never happened, but let's imagine there's a bug on the
    // backend side.
    const sortedOrganizations = organizationsSorter.sort([
      buildOrganization(1, 'Organization 1', null),
      buildOrganization(2, 'Organization 2', null),
    ]);

    expect(sortedOrganizations[0].name).toEqual('Organization 1');
  });

  it('returns an empty list if there is no “base” organization', () => {
    // This case should never happened, but let's imagine there's a bug on the
    // backend side.
    const sortedOrganizations = organizationsSorter.sort([
      buildOrganization(1, 'Organization 1', 2),
      buildOrganization(2, 'Organization 2', 1),
    ]);

    expect(sortedOrganizations.length).toEqual(0);
  });
});
