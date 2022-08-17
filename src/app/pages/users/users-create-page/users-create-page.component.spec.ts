import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { LayoutModule } from 'src/app/layout/layout.module';

import { UsersCreatePageComponent } from './users-create-page.component';

describe('UsersCreatePageComponent', () => {
  let component: UsersCreatePageComponent;
  let fixture: ComponentFixture<UsersCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UsersCreatePageComponent,
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

    fixture = TestBed.createComponent(UsersCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
