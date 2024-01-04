import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IChange } from '../interfaces/change';
import Editor from '@toast-ui/editor';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
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

  public ngAfterViewChecked () {
    this.loadViewer();
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

  public changeSort () {
    if (this.sortItems === 'newest') {
      this.sortItems = 'oldest';
    } else {
      this.sortItems = 'newest';
    }
    this.sortItemsList();
  }

  public sortIcon () {
    if (this.sortItems === 'newest') {
      return 'arrow-down-wide-short';
    }
    return 'arrow-down-short-wide';
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

  public focusoutDescription () {
    const message = this.editorConfiguration.getMarkdown();
    if (message === '') {
      this.expandedWriteBox = false;
    }
  }

  public submitMessage () {
    const message = this.editorConfiguration.getMarkdown();
    const data = {
      message,
      name: this.currentMessage?.name,
      options: [],
    };
    this.newMessageEvent.emit(data);
    this.expandedWriteBox = false;
    this.editorConfiguration.reset();
  }

  public goToBottom () {
    window.scrollTo(0, document.body.scrollHeight);
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

  private loadViewer () {
    for (const change of this.changes) {
      if (change.customdata !== undefined && change.customdata.type === 'message') {
        // eslint-disable-next-line no-unused-vars
        const toto = new Viewer({
          el: document.querySelector('#messageId-' + change.id) as HTMLElement,
          initialValue: change.customdata.message,
        });
      }
    }
  }
}
