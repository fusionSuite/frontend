import { TestBed } from '@angular/core/testing';

import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sends success notifications to subscribers', () => {
    service.subscribe((notification) => {
      expect(notification.message).toEqual('A successful message');
      expect(notification.status).toEqual('success');
    });

    service.success('A successful message');
  });

  it('sends error notifications to subscribers', () => {
    service.subscribe((notification) => {
      expect(notification.message).toEqual('An error message');
      expect(notification.status).toEqual('error');
    });

    service.error('An error message');
  });
});
