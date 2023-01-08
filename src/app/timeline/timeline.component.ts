import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IChange } from '../interfaces/change';
import Editor from '@toast-ui/editor';
import { formatDistanceToNowStrict } from 'date-fns';
import { ICreateMessage } from '../interfaces/create/message';
import { ICreateMessages } from '../interfaces/create/messages';
import { ItemsApi } from '../api/items';
import { NotificationsService } from '../notifications/notifications.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
})
export class TimelineComponent implements OnChanges {
  @Input() changes: IChange[] = [];
  @Input() haveMessages: boolean = false;
  @Input() typeId: number = 0;
  @Input() itemId: number = 0;
  @Input() messages: ICreateMessages = {
    messages: [],
    defaultNane: '',
  };

  @Output() newMessageEvent = new EventEmitter<any>();

  /*
  # Specs for the message

  ## option 1
  
    * have itemlinks in the main item
    * options are properties on this itemlink
    * define the property with the message (must be valuetype=text)
    
  ## option 2

    * have itemlinks in the main item
    * some option = another itenlinks
    * define the property with the message (must be valuetype=text)

    example
      * ticketmessage (type)
      * option solution -> ticketsolution (type)
      * private -> ticketmessage (type) + private (property)

  ## data format
  in messagedefinition, can have multiple and define the default



  ## who add messages in backend ?

  2 choices:
    * timeline
    * item -> it must be this !!!

  ticket -> message  (prop 10 itemlinks)  -> prop `private` in message (boolean)
         -> solution (prop 11 itemlinks)

  [
    {
      label: string;
      name: string;
      default: boolean;
      options: ICreateMessageOption[];
    }
  ]

  or more simple because it's page call the timeline add into backend
  {
    messages: {
      label: string;
      name: string;
      options: {
        label: string;
        name: string;
        type: 'checkbox'|'select';
        selectValues: string[];
        selectDefault: string;
        checkboxDefault: boolean;
      }[];
    }[];
    defaultNane: string;
  }

  */

  public showEvents :boolean = true;
  public showConversation :boolean = true;
  public sortItems :string = 'newest';
  public expandedWriteBox :Boolean = false;
  public currentMessage: ICreateMessage|null = null;
  public addMessageForm = new FormGroup({
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    options: new FormArray<FormControl>([]),
  });

  public editorConfiguration: any;
  private loop: boolean = false;

  constructor (
    private itemsApi: ItemsApi,
    private notificationsService: NotificationsService,
  ) { }

  ngOnChanges () {
    for (const change of this.changes) {
      if (change.user !== null) {
        const words = change.message.split(' ');
        if (words[0] === change.user.name) {
          words.shift();
          change.message = words.join(' ');
        }
      }
    }
    this.sortItemsList();
    this.setCurrentMessage();
    this.setOptions();
    if (!this.loop) {
      this.loop = true;
      this.loopUdpateDateDistance();
    }
  }

  /**
   * Load editoronly when the display all initialized, because editor element in ng-template
   */
  public ngAfterViewInit () {
    if (this.haveMessages) {
      this.loadEditor();
    }
  }

  public loadEditor () {
    this.editorConfiguration = new Editor({
      el: document.querySelector('#editor') as HTMLElement,
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      usageStatistics: false,
      toolbarItems: [
        'heading', 'bold', 'italic', 'strike',
        'hr', 'quote',
        'ul', 'ol', 'indent', 'outdent',
        'table', 'image', 'link',
      ],
      // plugins: [colorSyntax]
    });
    this.editorConfiguration.on('focus', (event: Event) => this.updateDescription(event));
    this.editorConfiguration.getMarkdown();
  }

  public toggleDisplayEvents () {
    this.showEvents = !this.showEvents;
  }

  public toggleDisplayConversation () {
    this.showConversation = !this.showConversation;
  }

  public changeSort (event :any) {
    this.sortItems = event.target.value;
    this.sortItemsList();
  }

  public onFormSubmit () {

  }

  /**
   * When user entre text in the area, expand the window
   * @param description
   */
  public updateDescription (description: Event) {
    this.expandedWriteBox = true;
  }

  public submitMessage () {
    const message = this.editorConfiguration.getMarkdown();
    const data = {
      message,
      name: this.currentMessage?.name,
      options: [],
    };
    /*
      message: '',
      name: 'xxxxx',
      options: [
        {
          name: 'incidentmessageprivate',
          value: any
        }
      ]

    */
    this.newMessageEvent.emit(data);
    // if (this.currentMessage !== null) {
    //   // create item
    //   const data: ICreateItem = {
    //     name: 'test',
    //     type_id: this.currentMessage?.type.id,
    //   };
    //   this.itemsApi.create(this.currentMessage?.type.internalname, data)
    //     .pipe(
    //       catchError((error: HttpErrorResponse) => {
    //         this.notificationsService.error(error.error.message);
    //         return throwError(() => new Error(error.error.message));
    //       }),
    //     ).subscribe((result: any) => {
    //       this.notificationsService.success($localize `The item has been created successfully.`);

    //       // attach item.id to the item property itemlinks
    //       if (this.currentMessage !== null) {
    //         this.itemsApi.updateProperty(result.id, this.currentMessage.propertyId, { message })
    //           .pipe(
    //             catchError((error: HttpErrorResponse) => {
    //               this.notificationsService.error(error.error.message);
    //               return throwError(() => new Error(error.error.message));
    //             }),
    //           ).subscribe((result2: any) => {
    //             this.notificationsService.success($localize `The property has been updated successfully.`);
    //             if (this.currentMessage !== null) {
    //               this.itemsApi.createItemlink(this.itemId, this.currentMessage?.propertyId, result2.id)
    //                 .pipe(
    //                   catchError((error: HttpErrorResponse) => {
    //                     this.notificationsService.error(error.error.message);
    //                     return throwError(() => new Error(error.error.message));
    //                   }),
    //                 ).subscribe((result2: any) => {
    //                   this.notificationsService.success($localize `The itenlink has been added successfully.`);
    //                 });
    //             }
    //           });
    //       }
    //     });
    // }

    // console.log(this.settingsService.getTypeByInternalname('incidentmessage'));
    // const type = this.settingsService.getTypeByInternalname('incidentmessage');
    // const properties = [];
    // let value = '';
    // for (let prop of type.properties) {
    //   value = this.editTicketForm.get(prop.internalname)?.value;
    //   if (value !== '' && value !== undefined) {
    //     properties.push({
    //       property_id: prop.id,
    //       value
    //     });
    //   }
    // }

    // // post a 'incidentmessage'
    // const typeLink = {
    //   internalName: 'incidentmessage',
    //   name: 'message',
    //   properties,
    // };
    // const item = {
    //   id: this.item.id,
    //   propertyId: 96,
    // };
    // this.itemsApi.postItemAndLink(typeLink, item)
    // .then( (val) => {
    //   this.notificationsService.success($localize `The message has been successfully posted.`);
    //   this.editTicketForm.reset();
    //   this.ngOnInit();
    // });
  }

  private sortItemsList () {
    if (this.sortItems === 'newest') {
      this.changes = this.changes.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else {
      this.changes = this.changes.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      this.expandedWriteBox = true;
    }
  }

  private setCurrentMessage () {
    for (const message of this.messages.messages) {
      if (this.messages.defaultNane === message.name) {
        this.currentMessage = message;
        return;
      }
    }
  }

  private setOptions () {
    console.log(this.currentMessage);
    if (this.currentMessage === null) {
      return;
    }
    this.addMessageForm.controls.options = new FormArray<FormControl>([]);
    const options = this.addMessageForm.controls.options;
    for (const option of this.currentMessage.options) {
      if (option.type === 'checkbox') {
        options.push(new FormControl(option.checkboxDefault));
      } else if (option.type === 'select') {
        options.push(new FormControl(option.selectDefault));
      }
    }
  }

  private loopUdpateDateDistance () {
    setTimeout(() => {
      for (const change of this.changes) {
        if (change.customdata !== undefined) {
          change.customdata.dateDistance = formatDistanceToNowStrict(new Date(change.created_at), { addSuffix: true });
        }
      }
      this.loopUdpateDateDistance();
    }, 60000);
  }
}
