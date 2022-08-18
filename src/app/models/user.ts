import { Item } from './item';

export class User extends Item {
  get firstname () {
    return this.propValue('userfirstname', '');
  }

  get lastname () {
    return this.propValue('userlastname', '');
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
