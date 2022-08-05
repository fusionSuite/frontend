import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LayoutModule } from 'src/app/layout/layout.module';

import { NotFoundPageComponent } from './not-found-page.component';

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NotFoundPageComponent,
      ],
      imports: [
        LayoutModule,
        RouterTestingModule,
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
