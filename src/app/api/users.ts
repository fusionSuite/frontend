import { Injectable } from '@angular/core';

import { ApiV1 } from './v1';

@Injectable({
  providedIn: 'root',
})
export class UsersApi extends ApiV1 {
  public list () {
    return this.listItems('users');
  }

  public get (id: number) {
    return this.getItem(id);
  }

  public create (name: string, firstname: string, lastname: string, organizationId: number) {
    return this.postItem('users', name, {
      organization_id: organizationId,
      properties: this.buildProperties({
        userfirstname: firstname,
        userlastname: lastname,
      }),
    });
  }

  public delete (id: number) {
    return this.deleteItem(id);
  }
}
