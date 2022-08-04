import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { LayoutModule } from 'src/app/layout/layout.module';

import { OrganizationsListPageComponent } from './organizations-list-page.component';

describe('OrganizationsListPageComponent', () => {
  let component: OrganizationsListPageComponent;
  let fixture: ComponentFixture<OrganizationsListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrganizationsListPageComponent,
      ],
      imports: [
        FontAwesomeTestingModule,
        HttpClientTestingModule,
        LayoutModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
