import { Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IChange } from '../interfaces/change';
import { ICreateMessageOption } from '../interfaces/create/message-option';
import Editor from '@toast-ui/editor';
import { formatDistanceToNowStrict } from 'date-fns';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
})
export class TimelineComponent implements OnChanges {
  @Input() changes: IChange[] = [];
  @Input() haveMessages: boolean = false;
  @Input() messageOptions: ICreateMessageOption[] = [];

  public showEvents :boolean = true;
  public showConversation :boolean = true;
  public sortItems :string = 'newest';
  public expandedWriteBox :Boolean = false;
  public addMessageForm = new FormGroup({
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    options: new FormArray<FormControl>([]),
  });

  public editorConfiguration: any;
  private loop: boolean = false;

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

  private setOptions () {
    this.addMessageForm.controls.options = new FormArray<FormControl>([]);
    const options = this.addMessageForm.controls.options;
    for (const option of this.messageOptions) {
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
