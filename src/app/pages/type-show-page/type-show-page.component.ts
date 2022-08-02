import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ApiService } from 'src/app/services/api.service';

import { Type } from 'src/app/interfaces/type';

@Component({
  selector: 'app-type-show-page',
  templateUrl: './type-show-page.component.html',
  styleUrls: [],
})
export class TypeShowPageComponent implements OnInit {
  type: Type|null = null;
  name = '';

  constructor (
    private apiService: ApiService,
    private route: ActivatedRoute,
    private title: Title,
  ) { }

  ngOnInit (): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.apiService.getType(this.id)
        .subscribe((result: Type) => {
          this.type = result;
          this.name = this.type.name;
          this.title.setTitle(this.name);
        });
    });
  }

  get id () {
    return Number(this.route.snapshot.paramMap.get('id'));
  }
}
