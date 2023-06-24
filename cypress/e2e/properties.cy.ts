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

describe('properties', () => {
  beforeEach(() => {
  //   cy.dbReset();
    cy.login('admin', 'admin');
  });

  it('list properties', () => {
    cy.visit('/');

    cy.get('[data-cy="menu-configuration"]').click();
    cy.get('[data-cy="link-properties"]').should('exist');

    cy.get('[data-cy="link-properties"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/properties');

    cy.get('[data-cy="list-properties"]').should('contain', 'First name');
  });

  // TODO manage dataproviders
  it('create new property', () => {
    cy.visit('/config/properties');

    cy.get('[data-cy="link-properties-new"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/properties/new');

    cy.get('[data-cy="form-properties-new"] [name="name"]').type('test property string');
    cy.get('[data-cy="form-properties-new"] [name="valuetype"]').select('string');
    cy.get('[data-cy="form-properties-new"] [data-cy="submit"]').click();

    cy.get('[data-cy="notification-success"]').should('exist');

    // return to list page to check if new property exists
    cy.visit('/config/properties');
    cy.get('[data-cy="list-properties"]').should('contain', 'test property string');
  });

  it('test return to list button in create page', () => {
    cy.visit('/config/properties/new');

    cy.get('[data-cy="back-to-properties-list"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/properties');
  });

  it('display property', () => {
    cy.visit('/config/properties');

    cy.get('[data-cy="item-properties"] [name="test property string"]').click();
    cy.get('[data-cy="property-edit-switch-button"]').should('exist');
    cy.get('[data-cy="property-edit-name-textonly"]').should('exist');
    cy.get('[data-cy="property-edit-name-input"]').should('not.exist');
  });

  it('edit property', () => {
    cy.visit('/config/properties');

    cy.get('[data-cy="item-properties"] [name="test property string"]').click();
    cy.get('[data-cy="property-edit-switch-button"]').should('exist');
    cy.get('[data-cy="property-edit-switch-button"]').click();

    cy.get('[data-cy="property-edit-name-textonly"]').should('not.exist');
    cy.get('[data-cy="property-edit-name-input"]').should('exist');

    cy.get('[data-cy="property-edit-name-input"]').type('{selectAll}{del}string prop updated{enter}');

    cy.get('[data-cy="notification-success"]').should('exist');
  });
});
