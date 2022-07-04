import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeShowPageComponent } from './type-show-page.component';

describe('TypeShowPageComponent', () => {
  let component: TypeShowPageComponent;
  let fixture: ComponentFixture<TypeShowPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeShowPageComponent],
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
