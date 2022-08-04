import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  status: 'error' | 'success';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  stream = new Subject<Notification>();

  error (message: string) {
    this.notify(message, 'error');
  }

  success (message: string) {
    this.notify(message, 'success');
  }

  subscribe (next: (value: Notification) => void) {
    this.stream.subscribe(next);
  }

  private notify (message: string, status: 'error' | 'success') {
    this.stream.next({
      message,
      status,
      id: Date.now(),
    });
  }
}
