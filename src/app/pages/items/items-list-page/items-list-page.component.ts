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

import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { NotificationsService } from 'src/app/notifications/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { TypesApi } from 'src/app/api/types';
import { IType } from 'src/app/interfaces/type';
import { ItemsApi } from 'src/app/api/items';
import { IItem } from 'src/app/interfaces/item';
import { SettingsService } from 'src/app/services/settings.service';
import { Title } from '@angular/platform-browser';
import { IItemproperty } from 'src/app/interfaces/itemproperty';
import { IProperty } from 'src/app/interfaces/property';
import { ISearchgroup } from 'src/app/interfaces/searchgroup';

@Component({
  selector: 'app-items-list-page',
  templateUrl: './items-list-page.component.html',
  styleUrls: [],
})
export class ItemsListPageComponent implements OnInit {
  @ViewChild('searchBar') searchBarEl: ElementRef|undefined = undefined;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent (event: KeyboardEvent) {
    if (event.key === '/') {
      event.preventDefault();
      this.searchBarEl?.nativeElement.focus();
    }
  }

  itemsLoaded = false;
  items: IItem[] = [];
  // propertiesByIds: {[index: number]: IProperty} = {};
  public type: IType|null = null;
  public id: number = 0;
  public internalname: string = '';
  public xTotalCount = 0;
  public links: any = {};
  public contentRange = '';
  public search: string = '';
  public searchFocused: boolean = false;
  public searchGroups: ISearchgroup[] = [];
  public searchUpdate = new Subject<string>();
  public pages = [1];
  public currentPageNumber = 1;
  public actionDisplayed: 'filter'|'bookmark'|'save'|'columns'|'export'|'actions'|null = null;
  public columns: IProperty[] = [];
  public searchBuilder = false;
  public searchOperatorOptions: (string|null)[] = [];
  public searchField: 'name'|IProperty|null = null;
  public searchOperator: string|null = null;
  public searchValue = '';
  public searchTypeForSelect = null;
  public selectItems: any = {};
  public selectItemsFromList: any = {};
  public searchProposals: string[] = [];
  public lastSearchGroup: number | null = null;
  public searchGroupsInError: number[] = [];

  deleteForm = new FormGroup({});

  constructor (
    private typesApi: TypesApi,
    private itemsApi: ItemsApi,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    protected settingsService: SettingsService,
    private titleService: Title,
  ) {
    this.searchUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        if (value === '') {
          this.loadItems();
        } else {
          // this.loadItems('name=' + valuesearchGroups);
          const argsConters: any = {};
          for (const group of this.searchGroups) {
            if (argsConters[group.field] === undefined) {
              argsConters[group.field] = 0;
            }
            argsConters[group.field] += 1;
          }

          const query = [];
          const re = /(\[)(\w+)(\])/;
          for (const group of this.searchGroups) {
            let field = '';
            if (group.field.startsWith('name')) {
              field = group.field;
            } else {
              const prop = this.type?.properties.find((item: any) => item.internalname === group.field.replace('property.', '').replace(/(\[\w+\])/, ''));
              if (prop !== undefined) {
                field = group.field.replace('property.' + prop.internalname, 'property' + prop.id);
              }
            }

            if (argsConters[group.field] > 1) {
              query.push(field + '[]=' + group.value);
            } else {
              field = field.replace(re, '_$2');
              query.push(field + '=' + group.value);
            }
          }
          const queryStr = query.join('&');
          this.loadItems(queryStr);
          this.currentPageNumber = 1;
        }
      });
  }

  ngOnInit (): void {
    this.route.paramMap.subscribe(params => {
      const internalname = params.get('internalname');
      if (internalname !== null) {
        this.internalname = internalname;
        this.typesApi.get(this.settingsService.getTypeIdByInternalname(internalname))
          .subscribe((type: IType) => {
            this.type = type;
            this.id = type.id;
            this.titleService.setTitle(type.name);
            for (const prop of type.properties) {
              if (prop.valuetype === 'list') {
                this.selectItemsFromList[prop.id] = prop.listvalues;
              }
            }
            this.initSearchProposals();
          });

        this.loadItems();
      }
    });
  }

  public loadItems (suffix: string = '') {
    // load items
    this.itemsApi.listWithHeaders(this.internalname, suffix)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notificationsService.error(error.error.message);
          if (this.lastSearchGroup !== null) {
            this.searchGroupsInError.push(this.lastSearchGroup);
          }
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        this.searchGroupsInError = [];
        const body: IItem[] = result.body;
        this.xTotalCount = result.headers.get('x-total-count');
        this.pages = Array(Math.ceil(this.xTotalCount / 100)).fill(1).map((x, i) => i + 1);
        this.parseLink(result.headers.get('link'));
        this.parseContentRange(result.headers.get('content-range'));
        this.items = body;
        // manage to get current page number
        if (suffix !== '') {
          const matches = suffix.match(/&page=(\d+)/);
          if (matches !== null) {
            this.currentPageNumber = parseInt(matches[1]);
          }
        } else {
          this.currentPageNumber = 1;
        }
        this.itemsLoaded = true;
      });
  }

  deleteItem (item: IItem) {
    if (!window.confirm($localize `Do you really want to delete the item “${item.name}”?`)) {
      return;
    }
    this.itemsApi.delete(item.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.notificationsService.error(error.error.message);
          return throwError(() => new Error(error.error.message));
        }),
      ).subscribe((result: any) => {
        this.itemsLoaded = false;
        this.loadItems();

        this.notificationsService.success($localize `The item has been deleted successfully.`);
      });
  }

  private parseLink (link: string) {
    this.links = {};
    const links = link.split(', ');
    for (const mylink of links) {
      const parts = mylink.match(/([\w\d=&]+)>; rel="(\w+)"$/);
      if (parts !== undefined && parts?.length === 3 && parts[1] !== null && parts[2] !== null) {
        this.links[parts[2]] = parts[1];
      }
    }
  }

  private parseContentRange (contentRange: string) {
    contentRange = contentRange.replace('items', '');
    contentRange = contentRange.replace('/', ' of ');
    this.contentRange = contentRange;
  }

  // indexProperties (properties: IProperty[]) {
  //   const propsByIds: {[index: number]: IProperty} = {};
  //   properties.forEach((property) => {
  //     propsByIds[property.id] = property;
  //   });
  //   return propsByIds;
  // }

  public changePage (pageNumber: number) {
    let suffix = 'per_page=100&page=' + pageNumber;
    if (this.search !== '') {
      suffix += '&name=' + this.search;
    }
    this.loadItems(suffix);
  }

  public changeActionDisplayed (value: 'filter'|'bookmark'|'save'|'columns'|'export'|'actions') {
    if (this.actionDisplayed === value) {
      this.actionDisplayed = null;
    } else {
      this.actionDisplayed = value;
    }
  }

  public updateColumns (property: IProperty) {
    const myprop = this.columns.find(item => item.id === property.id);
    if (myprop === undefined) {
      this.columns.push(property);
    } else {
      // remove
      this.columns = this.columns.filter((item) => item.id !== property.id);
    }
  }

  public getProperty (property: IProperty, properties: IItemproperty[]) {
    const myprop = properties.find(item => item.id === property.id);
    if (myprop === undefined) {
      return '';
    } else {
      if (myprop.value === null) {
        return '';
      }
      if (myprop.valuetype === 'itemlinks' || myprop.valuetype === 'typelinks') {
        const myValues = [];
        for (const item of myprop.value) {
          myValues.push(item.name);
        }
        return myValues.join(', ');
      }
      if (myprop.value.id !== undefined) {
        return myprop.value.value;
      }
      return myprop.value;
    }
  }

  public catchslash (event: any) {
    // console.log(event);
    // if (event.keyCode === 13 && event.shiftKey !== 1) {
    //   event.preventDefault();
    // }
  }

  // ===============================================================================
  // ========== Search part
  // ===============================================================================

  public addSearchGroup (event: any) {
    this.addSearchGroupValue(event.target.value);
  }

  public updateSearchGroup (event: any, index: number) {
    this.updateSearchGroupValue(event.target.innerText, index);
  }

  public deleteSearchGroup (index: number) {
    this.searchGroups.splice(index, 1);
    if (this.searchGroups.length === 0) {
      this.searchUpdate.next('');
      this.searchGroupsInError = [];
    } else {
      const newList = [];
      for (const val of this.searchGroupsInError) {
        if (val > index) {
          newList.push(val - 1);
        } else if (val < index) {
          newList.push(val);
        }
      }
      this.searchGroupsInError = newList;
      this.searchUpdate.next('next');
    }
    this.search = '';
  }

  private addSearchGroupValue (value: string) {
    // if use datalist and field not complete, not consider run search
    if (value.startsWith('property.')) {
      if (!value.match(/:.+$/)) {
        // TODO
        // manage searchProposals list (datalist) from value yet, perhaps not required because setAutocompleteSearch() in input event
        return;
      }
    }

    if (value.includes(':')) {
      const parts = value.split(':');
      this.searchGroups.push({
        field: parts[0],
        value: parts[1],
      });
      this.lastSearchGroup = (this.searchGroups.length - 1);
      this.searchUpdate.next(value);
      this.search = '';
    } else {
      this.searchGroups.push({
        field: 'name[contains]',
        value,
      });
      this.lastSearchGroup = (this.searchGroups.length - 1);
      this.searchUpdate.next('name_contains:' + value);
      this.search = '';
    }
    this.initSearchProposals();
  }

  private updateSearchGroupValue (value: string, index: number) {
    if (value === undefined || value.trim() === '') {
      this.searchGroups.splice(index, 1);
      this.searchUpdate.next('next');
      this.search = '';
      return;
    }
    this.searchGroups[index].value = value;
    this.lastSearchGroup = index;
    this.searchUpdate.next(value);
    this.search = '';
  }

  public denyEnterEvent (event: any) {
    if (event.keyCode === 13 && event.shiftKey !== 1) {
      event.preventDefault();
    }
  }

  public searchSelectField () {
    if (typeof this.searchField === 'string' && this.searchField === 'name') {
      this.searchOperatorOptions = [null, 'in', 'contains', 'begin', 'end', 'not'];
    } else if (this.searchField !== null) {
      switch (this.searchField.valuetype) {
        case 'string':
        case 'text':
          this.searchOperatorOptions = ['in', 'contains', 'begin', 'end', 'not'];
          this.searchOperator = 'contains';
          break;

        case 'integer':
        case 'decimal':
        case 'number':
          this.searchOperatorOptions = ['less', 'greater'];
          this.searchOperator = 'contains';
          break;

        case 'boolean':
          this.searchOperatorOptions = ['is'];
          this.searchOperator = 'is';
          break;

        case 'datetime':
        case 'date':
        case 'time':
          this.searchOperatorOptions = ['contains', 'begin', 'end', 'before', 'after'];
          this.searchOperator = 'contains';
          break;

        case 'itemlink':
        case 'itemlinks':
        case 'typelink':
        case 'typelinks':
        case 'propertylink':
          this.searchOperatorOptions = ['is', 'in', 'contains', 'begin', 'end', 'not'];
          this.searchOperator = 'is';
          break;

        case 'list':
          this.searchOperatorOptions = ['is', 'in', 'contains', 'begin', 'end', 'not'];
          this.searchOperator = 'is';
          break;

        // "password","passwordhash"
      }
    }
  }

  public searchAdd () {
    let operator = '';
    if (this.searchOperator !== null) {
      operator = '[' + this.searchOperator + ']';
    }
    let field = '';
    if (typeof this.searchField === 'string') {
      field = this.searchField;
    } else {
      field = 'property.' + this.searchField?.internalname;
    }
    this.addSearchGroupValue(field + operator + ':' + this.searchValue);
    this.searchField = null;
    this.searchOperator = '';
    this.searchValue = '';
    this.initSearchProposals();
  }

  public searchSetFocus () {
    this.searchFocused = true;
  }

  public searchUnsetFocus () {
    this.searchFocused = false;
  }

  public searchFieldIsSelect () {
    if (
      this.searchField !== undefined &&
      this.searchField !== 'name' &&
      this.searchField !== null &&
      this.searchField.valuetype !== undefined &&
      this.searchOperator !== undefined &&
      this.searchOperator !== null
    ) {
      if (
        ['list', 'itemlink', 'itemlinks', 'typelink', 'typelinks', 'propertylink'].includes(this.searchField.valuetype) &&
        ['is', 'in', 'not'].includes(this.searchOperator)
      ) {
        return true;
      }
    }
    return false;
  }

  public getItemsForType (ev: any) {
    // if (typeInternalname in this.selectItems) {
    //   return;
    // }
    this.itemsApi.list(ev.internalname)
      .subscribe((result: any[]) => {
        let all: IItem[] = [];
        for (let page = 0; page < result.length; page++) {
          all = all.concat(result[page]);
        }
        this.selectItems[ev.internalname] = all;
      });
  }

  public setAutocompleteSearch (ev: any) {
    if (this.type !== undefined && this.type !== null) {
      if (ev.target === undefined || ev.target.value === '') {
        // // this.searchProposals.push('name');
        // for (const prop of this.type.properties) {
        //   this.searchProposals.push('property.' + prop.internalname);
        // }
      } else if (ev.target !== undefined) {
        if (ev.target.value.match(/^property.[a-zA-Z0-9]+$/)) {
          this.searchProposals = [];
          // TODO manage for this property the operator
          const splitted = ev.target.value.split('.');
          const prop = this.type.properties.find((item: any) => item.internalname === splitted[1]);
          if (prop !== undefined) {
            this.searchField = prop;
            this.searchSelectField();
            for (const operator of this.searchOperatorOptions) {
              this.searchProposals.push(ev.target.value + '[' + operator + ']:');
            }
          }
        } else if (ev.target.value.match(/^property.[a-zA-Z0-9]+\[is\]:$/)) {
          const splitted = ev.target.value.split('.');
          const prop = this.type.properties.find((item: any) => item.internalname === splitted[1].replace('[is]:', ''));
          if (prop !== undefined) {
            if (prop.valuetype === 'boolean') {
              this.searchProposals = [];
              this.searchProposals.push(ev.target.value + 'true');
              this.searchProposals.push(ev.target.value + 'false');
            } else if (prop.valuetype === 'list') {
              this.searchProposals = [];
              for (const listval of prop.listvalues) {
                this.searchProposals.push(ev.target.value + listval.value + '.' + listval.id);
              }
            }
            // TODO else
          }
        } else if (this.searchProposals.length === 0) {
          this.initSearchProposals();
        }
      }
    }
  }

  private initSearchProposals () {
    this.searchProposals = [];
    if (this.type !== undefined && this.type !== null) {
      // this.searchProposals.push('name');
      for (const prop of this.type.properties) {
        this.searchProposals.push('property.' + prop.internalname);
      }
    }
  }
}
