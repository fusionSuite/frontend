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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketsApi } from 'src/app/api/tickets';
import { IItem } from 'src/app/interfaces/item';
import { IPanel } from 'src/app/interfaces/panel';
import { buildEditorConfiguration } from 'src/app/utils/tinycme-editor-configuration';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { ITimelineitem } from 'src/app/interfaces/timelineitem';
// import { ApiV1 } from 'src/app/api/v1';
import { SettingsService } from 'src/app/services/settings.service';
import { ItemsApi } from 'src/app/api/items';
import { NotificationsService } from 'src/app/notifications/notifications.service';

@Component({
  selector: 'app-tickets-edit-page',
  templateUrl: './tickets-edit-page.component.html',
  styleUrls: [],
})
export class TicketsEditPageComponent implements OnInit {
  public item :any;
  public editorConfiguration = buildEditorConfiguration($localize `Description (Rich Text Area)`);
  public itemLoaded = false;
  public editTicketForm = new FormGroup({
    incidentmessagedescription: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    incidentmessageprivate: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    incidentmessagesolution: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.required],
    }),

  });

  public expandedWriteBox :Boolean = false;
  public panels :IPanel[] = [];
  public showEvents :boolean = true;
  public showConversation :boolean = true;
  public itemsList :ITimelineitem[] = [];
  public createdAt :string = '';
  public sortItems :string = 'newest';
  public userInformationId :any = null;

  constructor (
    private ticketsApi: TicketsApi,
    private itemsApi: ItemsApi,
    private settingsService: SettingsService,
    private notificationsService: NotificationsService,
  ) {

  }

  ngOnInit (): void {
    this.ticketsApi.get(3)
      .subscribe((result: IItem) => {
        console.log(result);
        this.item = result;
        this.parseItem();
        this.createdAt = formatDistanceToNow(new Date(result.created_at), { addSuffix: true });

        this.declarePanels();

        this.itemLoaded = true;
      });
  }

  public onFormSubmit () {

  }

  public parseItem () {
    const itemsList :ITimelineitem[] = [];

    itemsList.push({
      user: {
        firstName: 'Tony',
        lastName: 'Stark',
        id: 10,
        avatar: null,
        function: 'user',
      },
      icon: 'user',
      message: 'Bla bla bla<br>test2\nMultiple lines',
      sourceMessage: 'envelope',
      date: new Date('2022-10-10T15:18:03.000000Z'),
      dateDistance: formatDistanceToNow(new Date('2022-10-10T15:18:03.000000Z'), { addSuffix: true }),
      type: 'message',
    });

    itemsList.push({
      user: {
        firstName: 'Steve',
        lastName: 'Rogers',
        id: 2,
        avatar: null,
        function: 'tech',
      },
      icon: 'headset',
      message: 'Avez-vous les informations à propos de l\'erreur rencontrée?',
      sourceMessage: null,
      date: new Date('2022-10-07T09:24:03.000000Z'),
      dateDistance: formatDistanceToNow(new Date('2022-10-07T09:24:03.000000Z'), { addSuffix: true }),
      type: 'message',
    });

    itemsList.push({
      user: {
        firstName: 'Steve',
        lastName: 'Rogers',
        id: 2,
        avatar: null,
        function: 'tech',
      },
      icon: 'user-plus',
      message: 'assigned the ticket to himself',
      sourceMessage: null, // null | mail | web | rule
      date: new Date('2022-10-05T09:19:03.000000Z'),
      dateDistance: formatDistanceToNow(new Date('2022-10-05T09:19:03.000000Z'), { addSuffix: true }),
      type: 'event',
    });

    itemsList.push({
      user: {
        firstName: 'rule engine',
        lastName: 'rule egine',
        id: null,
        avatar: null,
        function: 'tech',
      },
      icon: 'bolt',
      message: 'changed status to "in progress"',
      sourceMessage: null, // null | mail | web | rule
      date: new Date('2022-10-05T09:19:03.000000Z'),
      dateDistance: formatDistanceToNow(new Date('2022-10-05T09:19:03.000000Z'), { addSuffix: true }),
      type: 'event',
    });

    itemsList.push({
      user: {
        firstName: 'Steve',
        lastName: 'Rogers',
        id: 2,
        avatar: null,
        function: 'tech',
      },
      icon: 'bolt',
      message: 'changed status to "pending"',
      sourceMessage: null, // null | mail | web | rule
      date: new Date('2022-10-10T11:54:03.000000Z'),
      dateDistance: formatDistanceToNow(new Date('2022-10-10T11:54:03.000000Z'), { addSuffix: true }),
      type: 'event',
    });

    itemsList.push({
      user: {
        firstName: 'Tony',
        lastName: 'Stark',
        id: 10,
        avatar: null,
        function: 'user',
      },
      icon: 'user',
      message: 'Bonjour, mon ordinateur n\'arrête pas de s\'éteindre, et plusieurs fois par jour',
      sourceMessage: 'envelope',
      date: new Date('2022-10-03T16:18:03.000000Z'),
      dateDistance: formatDistanceToNow(new Date('2022-10-03T16:18:03.000000Z'), { addSuffix: true }),
      type: 'message',
    });

    itemsList.push({
      user: {
        firstName: 'Steve',
        lastName: 'Rogers',
        id: 2,
        avatar: null,
        function: 'tech',
      },
      icon: 'ticket',
      message: 'added ticket "la démo n\'est pas à jour sur la pré-prod #44"',
      sourceMessage: null, // null | mail | web | rule
      date: new Date('2022-10-10T11:59:03.000000Z'),
      dateDistance: formatDistanceToNow(new Date('2022-10-10T11:59:03.000000Z'), { addSuffix: true }),
      type: 'event',
    });

    itemsList.push({
      user: {
        firstName: 'Steve',
        lastName: 'Rogers',
        id: 2,
        avatar: null,
        function: 'tech',
      },
      icon: 'ticket',
      message: 'added ticket "la démo n\'est pas à jour sur la pré-prod #65"',
      sourceMessage: null, // null | mail | web | rule
      date: new Date('2022-10-12T17:22:03.000000Z'),
      dateDistance: formatDistanceToNow(new Date('2022-10-12T17:22:03.000000Z'), { addSuffix: true }),
      type: 'event',
    });

    // Push messages from the backend
    for (let ticketMessage of this.item.properties[9].value) {
      if (ticketMessage === null) {
        continue;
      }
      itemsList.push({
        user: {
          firstName: ticketMessage.created_by.first_name,
          lastName: ticketMessage.created_by.last_name,
          id: ticketMessage.created_by.id,
          avatar: null,
          function: 'tech',
        },
        icon: 'ticket',
        message: ticketMessage.properties[0].value,
        sourceMessage: null, // null | mail | web | rule
        date: new Date(ticketMessage.created_at),
        dateDistance: formatDistanceToNow(new Date(ticketMessage.created_at), { addSuffix: true }),
        type: 'message',
      });
    }


    this.itemsList = itemsList;
    this.sortItemsList();
  }

  private sortItemsList () {
    if (this.sortItems === 'newest') {
      this.itemsList = this.itemsList.sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      );
    } else {
      this.itemsList = this.itemsList.sort(
        (a, b) => a.date.getTime() - b.date.getTime(),
      );
      this.expandedWriteBox = true;
    }
  }

  /**
   * When user entre text in the area, expand the window
   * @param description
   */
  public updateDescription (description:string) {
    if (description !== '') {
      this.expandedWriteBox = true;
    } else {
      if (this.sortItems === 'newest') {
        this.expandedWriteBox = false;
      }
    }
  }

  public toggleDisplayEvents () {
    if (this.showEvents) {
      this.showEvents = false;
    } else {
      this.showEvents = true;
    }
  }

  public toggleDisplayConversation () {
    if (this.showConversation) {
      this.showConversation = false;
    } else {
      this.showConversation = true;
    }
  }

  private declarePanels () {
    // declare actors
    this.panels.push({
      title: 'Actors',
      icon: 'user-group',
      values: [
        {
          title: 'Requester',
          value: ['Tony Stark', 'John Doe'],
          type: 'multiple',
        },
        {
          title: 'Assignee',
          value: ['Steve Roger'],
          type: 'multiple',
        },
      ],
    });

    // declare priority
    this.panels.push({
      title: 'Priority',
      icon: 'bolt',
      values: [
        {
          title: 'Low',
          value: [],
          type: 'status',
        },
        {
          title: 'Upgency',
          value: ['low'],
          type: 'single',
        },
        {
          title: 'Assignee',
          value: ['normal'],
          type: 'single',
        },
      ],
    });

    // declare Contract
    this.panels.push({
      title: 'Contract',
      icon: 'file-contract',
      values: [
        {
          title: 'usage',
          value: ['2 of 12 hours'],
          type: 'single',
        },
        {
          title: '',
          value: ['20'],
          type: 'progressbar',
        },
      ],
    });

    // declare Related tickets
    this.panels.push({
      title: 'Related ticket',
      icon: 'ticket',
      values: [
        {
          title: 'Close',
          value: ['la démo n\'est pas à jour sur la pré-prod #65'],
          type: 'single',
        },
        {
          title: 'Linked to',
          value: ['la démo n\'est pas à jour sur la pré-prod #44'],
          type: 'single',
        },
      ],
    });
  }

  public changeSort (event :any) {
    this.sortItems = event.target.value;
    this.sortItemsList();
  }

  public setUserInformationId(id: any) {
    this.userInformationId = id;
  }

  public onCloseUserInformation(event: any) {
    console.log(event);
    this.userInformationId = null;
  }

  public goToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  public goToUp() {
    window.scrollTo(0, 0);
  }

  public submitMessage() {
    // propertiesIndexedByInternalname
    console.log(this.settingsService.getTypeByInternalname('incidentmessage'));
    const type = this.settingsService.getTypeByInternalname('incidentmessage');
    const properties = [];
    let value = '';
    for (let prop of type.properties) {
      value = this.editTicketForm.get(prop.internalname)?.value;
      if (value !== '' && value !== undefined) {
        properties.push({
          property_id: prop.id,
          value
        });
      }
    }

    // post a 'incidentmessage'
    const typeLink = {
      internalName: 'incidentmessage',
      name: 'message',
      properties,
    };
    const item = {
      id: this.item.id,
      propertyId: 96,
    };
    this.itemsApi.postItemAndLink(typeLink, item)
    .then( (val) => {
      this.notificationsService.success($localize `The message has been successfully posted.`);
      this.editTicketForm.reset();
      this.ngOnInit();
    });
  }

}
