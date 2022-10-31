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

import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { TicketsApi } from "src/app/api/tickets";
import { UsersApi } from "src/app/api/users";
import { IItem } from "src/app/interfaces/item";
import { IUserinformationInfoblock } from "src/app/interfaces/userinformation-infoblock";
import { NotificationsService } from "src/app/notifications/notifications.service";

@Component({
  selector: 'modal-useriformation',
  templateUrl: './userinformation.component.html',
  styleUrls: [],
})
export class UserinformationComponent implements OnChanges {
  @Input() public userId: any = null;
  @Output() closed = new EventEmitter<boolean>();

  public panelLeft :IUserinformationInfoblock[] = [];
  public panelRight :IUserinformationInfoblock[] = [];
  public tickets :IItem[] = [];

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.closed.emit(true);
  }

  constructor (
    private usersApi: UsersApi,
    private notificationsService: NotificationsService,
    private ticketsApi: TicketsApi,
  ) {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.userId !== null) {
      this.panelLeft = [];
      this.panelRight = [];
      this.tickets = [];
      this.usersApi.get(this.userId)
      .subscribe(res => {
        console.log(res);
        for(let prop of res.properties) {
          if (prop.internalname == 'userfirstname') {
            this.panelLeft.push({
              title: 'First name',
              icon: 'angle-right',
              value: prop.value,
              type: 'normal'
            });
          }
          if (prop.internalname == 'userlastname') {
            this.panelLeft.push({
              title: 'Last name',
              icon: 'angle-right',
              value: prop.value,
              type: 'normal'
            });
          }
        }
        this.panelLeft.push({
          title: 'Email',
          icon: 'envelope',
          value: 's.rogers@avenger.hero',
          type: 'email'
        });

        this.panelRight.push({
          title: 'Fixed phone',
          icon: 'phone',
          value: '04.04.00.00.00',
          type: 'phone'
        });
        this.panelRight.push({
          title: 'Mobile phone',
          icon: 'mobile',
          value: '06.00.00.00.99',
          type: 'phone'
        });
        this.panelRight.push({
          title: 'Location',
          icon: 'building',
          value: 'C465, battiment H, Lyon',
          type: 'normal'
        });
      });
      this.ticketsApi.list()
        .subscribe((res) => {
          this.tickets = res;
        });
    }
  }

  public copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    this.notificationsService.success($localize `The value has been copied in clipboard successfully.`);

  }

  public closeModal() {
    this.closed.emit(true);
  }
};
