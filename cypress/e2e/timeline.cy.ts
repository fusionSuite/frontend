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

describe('timeline in properties', () => {
  beforeEach(() => {
    cy.login('admin', 'admin');
  });

  it('create new property', () => {
    cy.visit('/config/properties');

    cy.get('[data-cy="link-properties-new"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/config/properties/new');

    cy.get('[data-cy="form-properties-new"] [name="name"]').type('my best property');
    cy.get('[data-cy="form-properties-new"] [name="valuetype"]').select('string');
    cy.get('[data-cy="form-properties-new"] [data-cy="submit"]').click();

    cy.get('[data-cy="notification-success"]').should('exist');

    // return to list page to check if new property exists
    cy.visit('/config/properties');
    cy.get('[data-cy="list-properties"]').should('contain', 'my best property');
  });

  it('edit property', () => {
    cy.visit('/config/properties');

    cy.get('[data-cy="item-properties"] [name="my best property"]').click();
    cy.get('[data-cy="property-edit-switch-button"]').should('exist');
    cy.get('[data-cy="property-edit-switch-button"]').click();

    cy.get('[data-cy="property-edit-name-textonly"]').should('not.exist');
    cy.get('[data-cy="property-edit-name-input"]').should('exist');

    cy.get('[data-cy="property-edit-name-input"]').type('{selectAll}{del}blablabla{enter}');
    cy.wait(1000);

    cy.get('[data-cy="property-edit-name-input"]').type('{selectAll}{del}village{enter}');
  });

  it('check timeline', () => {
    cy.visit('/config/properties');

    cy.get('[data-cy="item-properties"] [name="village"]').click();

    cy.get('[data-cy="timeline-title"]').should('exist');
    cy.get('[data-cy="timeline-event"]').should('have.length', 2);
    cy.scrollTo('bottom');

    cy.get('[data-cy="timeline-event"]').eq(0).should('contain', 'village');
    cy.get('[data-cy="timeline-event"]').eq(1).should('contain', 'blablabla');
  });

  it('check timeline - oldest first', () => {
    cy.visit('/config/properties');
    cy.get('[data-cy="item-properties"] [name="village"]').click();

    cy.get('[data-cy="property-edit-switch-button"]').should('exist');
    cy.get('[data-cy="property-edit-switch-button"]').click();
    cy.scrollTo('bottom');

    cy.get('[data-cy="timeline-changesort"]').select('oldest');
    cy.wait(500);
    cy.get('[data-cy="timeline-title"]').should('exist');
    cy.get('[data-cy="timeline-event"]').should('have.length', 2);

    cy.get('[data-cy="timeline-event"]').eq(0).should('contain', 'blablabla');
    cy.get('[data-cy="timeline-event"]').eq(1).should('contain', 'village');
  });
});
