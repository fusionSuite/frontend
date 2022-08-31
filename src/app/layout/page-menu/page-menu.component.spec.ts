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
import { RouterTestingModule } from '@angular/router/testing';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { PageMenuComponent } from './page-menu.component';

describe('PageMenuComponent', () => {
  let component: PageMenuComponent;
  let fixture: ComponentFixture<PageMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageMenuComponent],
      imports: [
        FontAwesomeTestingModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
