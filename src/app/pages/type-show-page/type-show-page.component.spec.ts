import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PageComponent } from 'src/app/layout/page/page.component';

import { TypeShowPageComponent } from './type-show-page.component';

describe('TypeShowPageComponent', () => {
  let component: TypeShowPageComponent;
  let fixture: ComponentFixture<TypeShowPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PageComponent,
        TypeShowPageComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TypeShowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
