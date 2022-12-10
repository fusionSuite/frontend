/**
 * FusionSuite - Frontend
 * Copyright (C) 2022 FusionSuite
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
      let timeout = 10000;
      if (notification.status === 'success') {
        timeout = 4000;
      }

      setTimeout(() => {
        this.closeNotification(notification);
      }, timeout);
    });
  }

  closeNotification (notification: Notification) {
    delete this.notificationsByIds[notification.id];
  }

  get notifications (): Notification[] {
    return Object.values(this.notificationsByIds);
  }
}
