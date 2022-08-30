import { Injectable } from '@angular/core';

import { ApiV1 } from './v1';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsApi extends ApiV1 {
  public list () {
    return this.listItems('organization');
  }

  public get (id: number) {
    return this.getItem(id);
  }

  public create (name: string, parentId: number) {
    return this.postItem('organization', name, {
      parent_id: parentId,
    });
  }

  public delete (id: number) {
    return this.deleteItem(id);
  }
}
