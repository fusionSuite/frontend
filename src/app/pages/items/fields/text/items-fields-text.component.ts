import { Component, Input, OnChanges } from '@angular/core';
import { IItemproperty } from 'src/app/interfaces/itemproperty';
import Editor from '@toast-ui/editor';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';

@Component({
  selector: 'app-items-fields-text',
  templateUrl: './items-fields-text.component.html',
})
export class ItemsFieldsTextComponent implements OnChanges {
  @Input() property: IItemproperty = {
    id: 0,
    name: '',
    internalname: '',
    valuetype: 'text',
    value: null,
    unit: '',
    listvalues: null,
    default: null,
    allowedtypes: [],
  };

  @Input() editionMode: boolean = false;
  public editorConfiguration: any;

  constructor () { }

  ngOnChanges () {
    console.log('LA');
    this.loadEditor();
  }

  public setValue (ev: any) {

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
    // this.editorConfiguration.on('focus', (event: Event) => this.updateDescription(event));
    this.editorConfiguration.getMarkdown();
  }
}
