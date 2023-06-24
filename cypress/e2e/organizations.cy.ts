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

describe('organizations', () => {
  beforeEach(() => {
    // cy.dbReset();
    cy.login('admin', 'admin');
  });

  it('creates and deletes organizations', () => {
    cy.visit('/');

    cy.get('[data-cy="menu-configuration"]').click();
    cy.get('[data-cy="link-organizations"]').should('exist');

    cy.get('[data-cy="link-organizations"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/organizations');

    cy.get('[data-cy="list-organizations"]').should('contain', 'My organization');

    cy.get('[data-cy="link-organizations-new"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/organizations/new');

    cy.get('[data-cy="form-organizations-new"] [name="name"]').type('Probesys');
    cy.get('[data-cy="form-organizations-new"] [name="parent-id"]').click();
    cy.get('[data-cy="form-organizations-new"] [name="parent-id"]').type('My organizat').type('{enter}');

    cy.get('[data-cy="form-organizations-new"] [data-cy="submit"]').click();

    cy.get('[data-cy="notification-success"]').should('exist');

    cy.visit('/organizations');
    cy.get('[data-cy="list-organizations"]').should('contain', 'Probesys');

    cy.get('[data-cy="list-organizations"]')
      .contains('Probesys')
      .parent('[data-cy="item-organizations"]')
      .find('[data-cy="button-organizations-delete"]').click();
    cy.get('[data-cy="list-organizations"]').should('not.contain', 'Probesys');
  });
});
