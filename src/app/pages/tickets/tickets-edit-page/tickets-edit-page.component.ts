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
import { IPanel, IPanelNew } from 'src/app/interfaces/panel';
import { buildEditorConfiguration } from 'src/app/utils/tinycme-editor-configuration';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { ITimelineitem } from 'src/app/interfaces/timelineitem';
// import { ApiV1 } from 'src/app/api/v1';
import { SettingsService } from 'src/app/services/settings.service';
import { ItemsApi } from 'src/app/api/items';
import { NotificationsService } from 'src/app/notifications/notifications.service';
import { elementAt } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IProperty } from 'src/app/interfaces/property';
import { User } from 'src/app/models/user';
import { UsersApi } from 'src/app/api/users';

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
  public panelsNew :IPanelNew[] = [];
  public showEvents :boolean = true;
  public showConversation :boolean = true;
  public itemsList :ITimelineitem[] = [];
  public createdAt :string = '';
  public sortItems :string = 'newest';
  public userInformationId :any = null;
  public users: IItem[] = [];

  constructor (
    private ticketsApi: TicketsApi,
    private itemsApi: ItemsApi,
    private settingsService: SettingsService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private usersApi: UsersApi,
  ) {

  }

  ngOnInit (): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.ticketsApi.get(Number(id))
      .subscribe((result: IItem) => {
        console.log(result);
        this.item = result;
        this.parseItem();
        this.createdAt = formatDistanceToNow(new Date(result.created_at), { addSuffix: true });

        this.declarePanels();

        this.itemLoaded = true;
        this.loadUsers();
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
      private: false,
      solution: false,
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
      private: false,
      solution: false,
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
      private: false,
      solution: false,
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
      private: false,
      solution: false,
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
      private: false,
      solution: false,
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
      private: false,
      solution: false,
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
      private: false,
      solution: false,
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
      private: false,
      solution: false,
    });

    // Push messages from the backend
    const messageProp = this.getPropertyByInternalname(this.item, 'incidentmessagelinks');
    if (messageProp !== undefined) {
      for (let ticketMessage of messageProp.value) {
        if (ticketMessage === null) {
          continue;
        }
        const privateMessageItem = this.getPropertyByInternalname(ticketMessage, 'incidentmessageprivate');
        const solutionMessageItem = this.getPropertyByInternalname(ticketMessage, 'incidentmessagesolution');
        const messageItem = this.getPropertyByInternalname(ticketMessage, 'incidentmessagedescription');
        let privateMessage = true;
        let solutionMessage = false;
        let message = '';
        if (privateMessageItem !== undefined) {
          privateMessage = privateMessageItem.value;
        }
        if (solutionMessageItem !== undefined) {
          solutionMessage = solutionMessageItem.value;
        }
        if (messageItem !== undefined) {
          message = messageItem.value;
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
          message: message,
          sourceMessage: null, // null | mail | web | rule
          date: new Date(ticketMessage.created_at),
          dateDistance: formatDistanceToNow(new Date(ticketMessage.created_at), { addSuffix: true }),
          type: 'message',
          private: privateMessage,
          solution: solutionMessage,
        });
      }
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
    this.panels = [];
    this.panelsNew = [];
    let items :any[] = [];

    // declare actors
    items = [];
    items = this.addItemToPanel(items, 'requestuser', 'single');
    items = this.addItemToPanel(items, 'affecteduser', 'single');
    items = this.addItemToPanel(items, 'userservice', 'single');

    this.panelsNew.push({
      title: 'Actors',
      icon: 'user-group',
      items,
    });

    // declare priority
    items = [];
    items = this.addItemToPanel(items, 'incidentpriority', 'status');
    items = this.addItemToPanel(items, 'urgency', 'single');
    items = this.addItemToPanel(items, 'impact', 'single');
    this.panelsNew.push({
      title: 'Priority',
      icon: 'bolt',
      items,
    });

    // others
    items = [];
    items = this.addItemToPanel(items, 'incidentstatus', 'single');
    items = this.addItemToPanel(items, 'incidentsla', 'single');
    items = this.addItemToPanel(items, 'location', 'single');
    items = this.addItemToPanel(items, 'incidentcategory', 'single');
    items = this.addItemToPanel(items, 'provenance', 'single');
    this.panelsNew.push({
      title: 'Other properties',
      icon: 'rectangle-list',
      items,
    });

    // declare Contract
    items = [];
    items = this.addItemToPanel(items, 'contractlink', 'single');
    if (items[0].valueList !== null) {
      const totalTime = this.getPropertyByInternalname(items[0].valueList, 'contracttimebought');
      const currentTime = this.getPropertyByInternalname(items[0].valueList, 'incidentmessagetime');
      console.log(currentTime);
      if (totalTime !== undefined && currentTime !== undefined) {
        items.push({
          title: '',
          id: 0,
          type: 'progressbar',
          valuetype: 'list',
          valueList: [],
          listvalues: [
            {
              id: 0,
              value: currentTime.value
            },
            {
              id: 0,
              value: totalTime.value
            },
          ],
        });
      }
    }

    this.panelsNew.push({
      title: 'Contract',
      icon: 'file-contract',
      items,
    });

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

  public updateProperty(event: any, propertyId: number) {
    this.itemsApi.patchItemProperty(this.item.id, propertyId, Number(event.target.value))
      .subscribe((res) => {
        console.log(res);
        this.notificationsService.success($localize `The property udpated successfully.`);
        this.editTicketForm.reset();
        this.ngOnInit();
      });
  }

  public calcPercentage(total: number, current: number) {
    return Math.ceil((current * 100) / total);
  }

  private addItemToPanel(items: any[], internalname: string, type: string) {
    const prop = this.item.properties.find((elem: any) => {
      return elem.internalname === internalname;
    });
    if (prop !== undefined) {
      let item: any = {
        title: prop.name,
        id: prop.id,
        type,
        valuetype: prop.valuetype,
        valueList: prop.value,
        listvalues: prop.listvalues,
      }
      if (prop.valuetype === 'list') {
        item.valueList = prop.value;
      }
      if (prop.valuetype === 'itemlink') {
        item.valueItemlink = prop.value;
      }
      items.push(item);
    }
    return items;
  }

  private getPropertyByInternalname(item: IItem, internalname: string) {
    return item.properties.find((elem: IProperty) => {
      return elem.internalname === internalname;
    });
  }

  private loadUsers () {
    this.users = [];
    this.usersApi.list()
      .subscribe((result: IItem[]) => {
        this.users = result;
        this.users.sort((u1, u2) => u1.name.localeCompare(u2.name));
      });
  }

  public displayUserName(user: IItem) {
    const firstName = this.getPropertyByInternalname(user, 'userfirstname');
    const lastName = this.getPropertyByInternalname(user, 'userlastname');
    if (firstName !== undefined && lastName!== undefined) {
      return firstName.value + ' ' + lastName.value;
    }
    return '';
  }
}
