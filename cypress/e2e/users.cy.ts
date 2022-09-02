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

describe('users', () => {
  beforeEach(() => {
    cy.dbReset();
    cy.login('admin', 'admin');
  });

  it('creates and deletes users', () => {
    cy.visit('/');

    cy.get('[data-cy="link-users"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/users');

    cy.get('[data-cy="list-users"]').should('contain', 'admin');

    cy.get('[data-cy="link-users-new"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/users/new');

    cy.get('[data-cy="form-users-new"] [name="firstname"]').type('Alix');
    cy.get('[data-cy="form-users-new"] [name="lastname"]').type('Prevost');
    cy.get('[data-cy="form-users-new"] [name="organization-id"]').select('My organization');
    cy.get('[data-cy="form-users-new"] [data-cy="submit"]').click();

    cy.get('[data-cy="notification-success"]').should('exist');

    cy.visit('/users');
    cy.get('[data-cy="list-users"]').should('contain', 'alix-prevost');

    cy.get('[data-cy="list-users"]')
      .contains('alix-prevost')
      .parent('[data-cy="item-users"]')
      .find('[data-cy="button-users-delete"]').click();
    cy.get('[data-cy="list-users"]').should('not.contain', 'alix-prevost');
  });
});
