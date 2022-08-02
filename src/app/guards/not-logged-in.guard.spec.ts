import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NotLoggedInGuard } from './not-logged-in.guard';

describe('NotLoggedInGuard', () => {
  let guard: NotLoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
    });
    guard = TestBed.inject(NotLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
