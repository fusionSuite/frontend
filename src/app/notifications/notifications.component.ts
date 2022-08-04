import { Component, OnInit } from '@angular/core';

import { NotificationsService, Notification } from './notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: [],
})
export class NotificationsComponent implements OnInit {
  notificationsByIds: {[index: number]: Notification} = {};

  constructor (
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit (): void {
    this.notificationsService.subscribe((notification: Notification) => {
      this.notificationsByIds[notification.id] = notification;

      setTimeout(() => {
        this.closeNotification(notification);
      }, 7000);
    });
  }

  closeNotification (notification: Notification) {
    delete this.notificationsByIds[notification.id];
  }

  get notifications (): Notification[] {
    return Object.values(this.notificationsByIds);
  }
}
