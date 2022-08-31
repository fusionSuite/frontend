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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { LayoutModule } from 'src/app/layout/layout.module';

import { OrganizationsCreatePageComponent } from './organizations-create-page.component';

describe('OrganizationsCreatePageComponent', () => {
  let component: OrganizationsCreatePageComponent;
  let fixture: ComponentFixture<OrganizationsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrganizationsCreatePageComponent,
      ],
      imports: [
        FontAwesomeTestingModule,
        HttpClientTestingModule,
        LayoutModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrganizationsCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
