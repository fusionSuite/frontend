import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketListPageComponent } from './ticket-list-page.component';

describe('TicketListPageComponent', () => {
  let component: TicketListPageComponent;
  let fixture: ComponentFixture<TicketListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketListPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
