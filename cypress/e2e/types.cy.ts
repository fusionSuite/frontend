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
  let descriptionID = 0;
  let myNewPanelId = 0;

  beforeEach(() => {
    cy.login('admin', 'admin');
  });

  it('list types', () => {
    cy.visit('/');

    cy.get('[data-cy="menu-configuration"]').filter(':visible').click();

    // for smartphone menu
    cy.get('body').then((body: any) => {
      if (body.find('[data-cy="link-nextbutton"]').filter(':visible').length > 0) {
        cy.get('[data-cy="link-nextbutton"]').filter(':visible').click();
      }
    });

    cy.get('[data-cy="link-types"]').filter(':visible').should('exist');

    cy.get('[data-cy="link-types"]').filter(':visible').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/types');

    cy.get('[data-cy="list-types"]').should('contain', 'Laptop');
  });

  it('create new type', () => {
    cy.visit('/config/types');

    cy.get('[data-cy="link-types-new"]').filter(':visible').click();
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
    cy.get('[data-cy="type-editionmode-button"]').should('exist');
    cy.get('[data-cy="type-edit-name-textonly"]').should('exist');
    cy.get('[data-cy="type-edit-name-input"]').should('not.exist');
    cy.get('[data-cy="type-categories-selectadd"]').should('not.exist');
  });

  it('edit type', () => {
    cy.visit('/config/types');

    // activate edition mode
    cy.get('[data-cy="item-types"] [name="test type string"]').click();
    cy.get('[data-cy="type-editionmode-button"]').should('exist');
    cy.get('[data-cy="type-editionmode-button"]').click();

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
    cy.get('[data-cy="type-editionmode-button"]').should('exist');
    cy.get('[data-cy="type-editionmode-button"]').click();

    // add property Address
    cy.intercept({
      method: 'GET',
      url: '**/v1/display/type/*/panels',
    }).as('panelsAPIRes');
    cy.get('[data-cy="type-categories-selectadd"]').should('exist');
    cy.get('[data-cy="type-categories-selectadd"]').click();
    cy.get('[data-cy="type-categories-selectadd"]').type('Addres');
    cy.wait(300);
    cy.get('[data-cy="type-categories-selectadd"]').type('{enter}');

    cy.wait('@panelsAPIRes')
      .its('response.body')
      .then((bodyJson) => {
        for (const panel of bodyJson) {
          for (const item of panel.items) {
            if (item.property_id === 6) {
              descriptionID = item.id;
              return;
            }
          }
        }
      });
    cy.get('[data-cy="notification-success"]').should('exist');
    cy.get('[data-cy="close-notification-button"]').click();
    cy.wait(1000);

    // add property Description
    cy.get('[data-cy="type-categories-selectadd"]').type('Descriptio').type('{enter}');
    cy.get('[data-cy="notification-success"]').should('exist');
    cy.get('[data-cy="close-notification-button"]').click();

    // check the 2 properties + check timeline
    cy.get('[data-cy="type-edit-properties-note"]').should('contain', '2 properties');
    cy.get('[data-cy="timeline-event"]').eq(0).should('contain', 'added the property "Description"');
    cy.get('[data-cy="timeline-event"]').eq(1).should('contain', 'added the property "Address"');
  });

  // refresh page to check property
  // it('reload page and check property is right here', () => {
  //   cy.visit('/config/types');

  // });

  // create panel
  it('create a new panel', () => {
    cy.visit('/config/types');

    // pass in edition mode
    cy.get('[data-cy="item-types"] [name="string type updated"]').click();
    cy.get('[data-cy="type-editionmode-button"]').should('exist');
    cy.get('[data-cy="type-editionmode-button"]').click();

    // click on button to create a new panel
    cy.get('[data-cy="type-edit-create-panel"]').click();
    cy.get('[data-cy="form-types-new-panel"]').should('exist');
    cy.get('[data-cy="form-types-new-panel"] [name="name"]').type('My very new panel');
    cy.get('[data-cy="form-types-new-panel"] [name="icon"]').type('beer').type('{enter}');
    cy.intercept({
      method: 'POST',
      url: '**/v1/display/type/panels',
    }).as('postNewPanelAPIRes');
    cy.get('[data-cy="form-types-new-panel"] [data-cy="submit"]').click();
    cy.wait('@postNewPanelAPIRes')
      .its('response.body')
      .then((bodyJson) => {
        myNewPanelId = bodyJson.id;
      });

    cy.get('[data-cy="notification-success"]').should('exist');
    cy.get('[data-cy="close-notification-button"]').click();

    // check panel created
    cy.get('[data-cy="form-types-list-panels"]').should('contain', 'My very new panel');
  });

  // change the property 'Description' to the new panel
  it('drag and drop property of default panel to our new panel', () => {
    // const dataTransfer = new DataTransfer();

    cy.visit('/config/types');

    // pass in edition mode
    cy.get('[data-cy="item-types"] [name="string type updated"]').click();
    cy.get('[data-cy="type-editionmode-button"]').should('exist');
    cy.get('[data-cy="type-editionmode-button"]').click();

    // cy.get('[id="panelitem-' + descriptionID + '"]').trigger('dragstart', {
    //   dataTransfer,
    // });

    // cy.get('[id="panel-' + myNewPanelId + '"]').trigger('drop', {
    //   dataTransfer,
    // });

    cy.get('[id="panelitem-' + descriptionID + '"]').drag('[id="panel-' + myNewPanelId + '"]');

    // check Description property in the new panel
    cy.get('[id="panel-' + myNewPanelId + '"]').should('contain', 'Address');
  });

  // refresh the page and see property in right panel

  // create a new menu (set the business menu a left to check add it)

  // select this menu for this type

  // type must be displayed without icon

  // set the icon of the menu item

  // type must be displayed with icon

  it('delete property in type', () => {
    cy.visit('/config/types');

    // pass in edition mode
    cy.get('[data-cy="item-types"] [name="string type updated"]').click();
    cy.get('[data-cy="type-editionmode-button"]').should('exist');
    cy.get('[data-cy="type-editionmode-button"]').click();

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
    cy.visit('/');

    cy.get('[data-cy="menu-configuration"]').filter(':visible').click();
    // for smartphone menu
    cy.get('body').then((body: any) => {
      if (body.find('[data-cy="link-nextbutton"]').filter(':visible').length > 0) {
        cy.get('[data-cy="link-nextbutton"]').filter(':visible').click();
        cy.get('[data-cy="link-nextbutton"]').filter(':visible').click();
      }
    });
    cy.get('[data-cy="link-templateimport"]').filter(':visible').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/templateimport');

    // import file with file input, select file and import it automatically
    cy.get('[data-cy="type-import-imputfile"]').selectFile('cypress/templates/test1.json');
    cy.get('[data-cy="notification-success"]').should('exist');

    cy.get('body').then((body: any) => {
      if (body.find('[data-cy="link-nextbutton"]').filter(':visible').length > 0) {
        cy.get('[data-cy="link-nextbutton"]').filter(':visible').click();
      }
    });
    cy.get('[data-cy="link-types"]').filter(':visible').click();

    // check the type in the template file is right in the type list
    cy.get('[data-cy="list-types"]').should('contain', 'test 1 import');
  });

  it('import template (dropping file)', () => {
    cy.visit('/');

    cy.get('[data-cy="menu-configuration"]').filter(':visible').click();
    // for smartphone menu
    cy.get('body').then((body: any) => {
      if (body.find('[data-cy="link-nextbutton"]').filter(':visible').length > 0) {
        cy.get('[data-cy="link-nextbutton"]').filter(':visible').click();
        cy.get('[data-cy="link-nextbutton"]').filter(':visible').click();
      }
    });
    cy.get('[data-cy="link-templateimport"]').filter(':visible').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/templateimport');

    // import file with drag and drop and import it automatically
    cy.get('[data-cy="type-import-dragdropzone"]').selectFile('cypress/templates/test2.json', { action: 'drag-drop' });
    cy.get('[data-cy="notification-success"]').should('exist');

    cy.get('body').then((body: any) => {
      if (body.find('[data-cy="link-nextbutton"]').filter(':visible').length > 0) {
        cy.get('[data-cy="link-nextbutton"]').filter(':visible').click();
      }
    });
    cy.get('[data-cy="link-types"]').filter(':visible').click();

    // check the type in the template file is right in the type list
    cy.get('[data-cy="list-types"]').should('contain', 'test 2 import');
  });

  it('import template file with wrong type', () => {
    cy.visit('/');

    cy.get('[data-cy="menu-configuration"]').filter(':visible').click();
    // for smartphone menu
    cy.get('body').then((body: any) => {
      if (body.find('[data-cy="link-nextbutton"]').filter(':visible').length > 0) {
        cy.get('[data-cy="link-nextbutton"]').filter(':visible').click();
        cy.get('[data-cy="link-nextbutton"]').filter(':visible').click();
      }
    });
    cy.get('[data-cy="link-templateimport"]').filter(':visible').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/templateimport');

    // import file with wrong type
    cy.get('[data-cy="type-import-imputfile"]').selectFile('cypress/templates/Logo-freebsd.svg');
    cy.get('[data-cy="notification-error"]').should('exist');
  });
});
