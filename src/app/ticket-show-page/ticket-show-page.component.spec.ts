import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketShowPageComponent } from './ticket-show-page.component';

describe('TicketShowPageComponent', () => {
  let component: TicketShowPageComponent;
  let fixture: ComponentFixture<TicketShowPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketShowPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketShowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
