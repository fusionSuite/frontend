import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket-show-page',
  templateUrl: './ticket-show-page.component.html',
  styleUrls: ['./ticket-show-page.component.scss']
})
export class TicketShowPageComponent implements OnInit {

  editorOpened = false;
  hideEvents = false;
  selectedStatus = 'Pending';
  isPrivate = false;

  statuses = [
    'Processing',
    'Pending',
    'Solved',
    'Closed',
  ]

  constructor() { }

  ngOnInit(): void {
  }

  switchEditor() {
    this.editorOpened = !this.editorOpened;
    if (this.editorOpened) {
      window.setTimeout(() => {
        const editor = document.getElementById('editor');
        editor?.querySelector('textarea')?.focus();
        editor?.scrollIntoView({
          block: 'start',
          behavior: 'smooth',
        });
      }, 10);
    }
  }

  switchEvents() {
    this.hideEvents = !this.hideEvents;
  }

  onSolutionChange(event: MouseEvent) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedStatus = 'Solved';
    } else {
      this.selectedStatus = 'Pending';
    }
  }

  onPrivateChange(event: MouseEvent) {
    const target = event.target as HTMLInputElement;
    this.isPrivate = target.checked;
  }

}
