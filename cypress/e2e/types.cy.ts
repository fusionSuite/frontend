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

describe('types', () => {
  beforeEach(() => {
    cy.login('admin', 'admin');
  });

  it('list types', () => {
    cy.visit('/');

    cy.get('[data-cy="link-types"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/types');

    cy.get('[data-cy="list-types"]').should('contain', 'Laptop');
  });

  it('create new type', () => {
    cy.visit('/config/types');

    cy.get('[data-cy="link-types-new"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/types/new');

    // fill form and submit
    cy.get('[data-cy="form-types-new"] [name="name"]').type('test type string');
    cy.get('[data-cy="form-types-new"] [data-cy="submit"]').click();

    cy.get('[data-cy="notification-success"]').should('exist');

    // return to list page to check if new type exists
    cy.visit('/config/types');
    cy.get('[data-cy="list-types"]').should('contain', 'test type string');
  });

  it('test return to list button in create page', () => {
    cy.visit('/config/types/new');

    cy.get('[data-cy="back-to-types-list"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/types');
  });

  it('display type', () => {
    cy.visit('/config/types');

    cy.get('[data-cy="item-types"] [name="test type string"]').click();
    cy.get('[data-cy="type-edit-switch-button"]').should('exist');
    cy.get('[data-cy="type-edit-name-textonly"]').should('exist');
    cy.get('[data-cy="type-edit-name-input"]').should('not.exist');
    cy.get('[data-cy="type-categories-selectadd"]').should('not.exist');
  });

  it('edit type', () => {
    cy.visit('/config/types');

    // activate edition mode
    cy.get('[data-cy="item-types"] [name="test type string"]').click();
    cy.get('[data-cy="type-edit-switch-button"]').should('exist');
    cy.get('[data-cy="type-edit-switch-button"]').click();

    // check name field is in edition mode
    cy.get('[data-cy="type-edit-name-textonly"]').should('not.exist');
    cy.get('[data-cy="type-edit-name-input"]').should('exist');

    cy.get('[data-cy="type-edit-name-input"]').type('{selectAll}{del}string type updated{enter}');

    cy.get('[data-cy="notification-success"]').should('exist');
  });

  it('test return to list button in edit page', () => {
    cy.visit('/config/types');

    cy.get('[data-cy="item-types"] [name="string type updated"]').click();
    cy.get('[data-cy="back-to-types-list"]').should('exist');

    cy.get('[data-cy="back-to-types-list"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/types');
  });

  it('add properties in type', () => {
    cy.visit('/config/types');

    // pass in edition mode
    cy.get('[data-cy="item-types"] [name="string type updated"]').click();
    cy.get('[data-cy="type-edit-switch-button"]').should('exist');
    cy.get('[data-cy="type-edit-switch-button"]').click();

    // add property Address
    cy.get('[data-cy="type-categories-selectadd"]').should('exist');
    cy.get('[data-cy="type-categories-selectadd"]').select('Address');
    cy.get('[data-cy="notification-success"]').should('exist');
    cy.get('[data-cy="close-notification-button"]').click();
    cy.wait(1000);

    // add property Description
    cy.get('[data-cy="type-categories-selectadd"]').select('Description');
    cy.get('[data-cy="notification-success"]').should('exist');
    cy.get('[data-cy="close-notification-button"]').click();

    // check the 2 properties + check timeline
    cy.get('[data-cy="type-edit-properties-note"]').should('contain', '2 properties');
    cy.get('[data-cy="timeline-event"]').eq(0).should('contain', 'added the property "Description"');
    cy.get('[data-cy="timeline-event"]').eq(1).should('contain', 'added the property "Address"');
  });

  it('delete property in type', () => {
    cy.visit('/config/types');

    // pass in edition mode
    cy.get('[data-cy="item-types"] [name="string type updated"]').click();
    cy.get('[data-cy="type-edit-switch-button"]').should('exist');
    cy.get('[data-cy="type-edit-switch-button"]').click();

    // delete the second property in the list (Description)
    cy.get('[data-cy="button-type-property-delete"]').eq(1).click();
    cy.get('[data-cy="notification-success"]').should('exist');
    cy.get('[data-cy="close-notification-button"]').click();

    // check have only 1 property (Address) + check timeline
    cy.get('[data-cy="type-edit-properties-note"]').should('contain', '1 property');
    cy.get('[data-cy="type-edit-property"]').eq(0).should('contain', 'Address');
    cy.get('[data-cy="timeline-event"]').eq(0).should('contain', 'deleted the property "Description"');
  });

  it('import template (import file)', () => {
    cy.visit('/config/types');

    cy.get('[data-cy="link-types-import"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/types/import');

    // import file with file input, select file and import it automatically
    cy.get('[data-cy="type-import-imputfile"]').selectFile('cypress/templates/test1.json');
    cy.get('[data-cy="notification-success"]').should('exist');

    cy.get('[data-cy="back-to-types-list"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/types');

    // check the type in the template file is right in the type list
    cy.get('[data-cy="list-types"]').should('contain', 'test 1 import');
  });

  it('import template (dropping file)', () => {
    cy.visit('/config/types');

    cy.get('[data-cy="link-types-import"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/types/import');

    // import file with drag and drop and import it automatically
    cy.get('[data-cy="type-import-dragdropzone"]').selectFile('cypress/templates/test2.json', { action: 'drag-drop' });
    cy.get('[data-cy="notification-success"]').should('exist');

    cy.get('[data-cy="back-to-types-list"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/types');

    // check the type in the template file is right in the type list
    cy.get('[data-cy="list-types"]').should('contain', 'test 2 import');
  });

  it('import template file with wrong type', () => {
    cy.visit('/config/types');

    cy.get('[data-cy="link-types-import"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/types/import');

    // import file with wrong type
    cy.get('[data-cy="type-import-imputfile"]').selectFile('cypress/templates/Logo-freebsd.svg');
    cy.get('[data-cy="notification-error"]').should('exist');
  });
});
