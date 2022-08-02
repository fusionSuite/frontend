import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsCreatePageComponent } from './organizations-create-page.component';

describe('OrganizationsCreatePageComponent', () => {
  let component: OrganizationsCreatePageComponent;
  let fixture: ComponentFixture<OrganizationsCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationsCreatePageComponent ]
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
