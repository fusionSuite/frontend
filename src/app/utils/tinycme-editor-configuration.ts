import { RawEditorOptions } from 'tinymce';

const defaultEditorConfiguration: RawEditorOptions = {
  plugins: 'emoticons lists link image table autoresize',
  toolbar: 'bold italic | numlist bullist | emoticons link image table',
  min_height: 250,
  autoresize_bottom_margin: 10,
  menubar: false,
  statusbar: false,
  contextmenu: false,
  promotion: false,
};

export function buildEditorConfiguration (label: string) {
  return {
    ...defaultEditorConfiguration,
    iframe_aria_text: label,
  };
};
