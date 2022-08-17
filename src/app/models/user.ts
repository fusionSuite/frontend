import { Item } from './item';

export class User extends Item {
  get firstname () {
    return this.getPropValueByInternalname('userfirstname', '');
  }

  get lastname () {
    return this.getPropValueByInternalname('userlastname', '');
  }

  get displayName () {
    const displayName = this.firstname + ' ' + this.lastname;
    if (displayName !== ' ') {
      return displayName;
    } else {
      return '';
    }
  }
}
