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

/// <reference types="cypress" />
// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

require('@4tw/cypress-drag-drop');

Cypress.Commands.add('dbReset', () => {
  cy.exec(`make -C ${Cypress.env('backend_path')} db-reset`);
});

Cypress.Commands.add('login', (login, password) => {
  cy.session([login, password], () => {
    cy.request('POST', Cypress.env('backend_server') + '/v1/token', {
      login,
      password,
    })
      .its('body')
      .then((result) => {
        cy.window().then((win) => {
          win.localStorage.setItem('authentication_token', result.token);
        });
      });
  });
});
