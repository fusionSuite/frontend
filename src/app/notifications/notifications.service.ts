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
