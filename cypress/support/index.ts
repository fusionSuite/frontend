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

declare namespace Cypress { // eslint-disable-line no-unused-vars
  interface Chainable<Subject> { // eslint-disable-line no-unused-vars
    /**
     * Login to the application.
     *
     * @example
     * cy.login('admin', 'admin')
     */
    login(login: string, password: string): Chainable<any>

    /**
     * Reset the database.
     *
     * @example
     * cy.dbReset()
     */
    dbReset(): Chainable<any>
  }
}
