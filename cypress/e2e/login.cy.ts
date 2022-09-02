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

describe('login', () => {
  beforeEach(() => {
    cy.dbReset();
  });

  it('works', () => {
    cy.visit('/');
    cy.url().should('equal', Cypress.config('baseUrl') + '/login');

    cy.get('[data-cy="form-login"] [name="username"]').type('admin');
    cy.get('[data-cy="form-login"] [name="password"]').type('admin');
    cy.get('[data-cy="form-login"] [data-cy="submit"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/');
  });

  it('fails if username is invalid', () => {
    cy.visit('/');
    cy.url().should('equal', Cypress.config('baseUrl') + '/login');

    cy.get('[data-cy="form-login"] [name="username"]').type('not a username');
    cy.get('[data-cy="form-login"] [name="password"]').type('admin');
    cy.get('[data-cy="form-login"] [data-cy="submit"]').click();
    cy.url().should('equal', Cypress.config('baseUrl') + '/login');

    cy.contains('Error').should('exist');
  });
});
