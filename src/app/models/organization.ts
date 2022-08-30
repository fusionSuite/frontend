import { Item } from './item';

export class Organization extends Item {
  public indentName (baseIndentation: number) {
    // Treepath length is a multiple of 4. We remove baseIndentation so the
    // root organization is not indented.
    const indentationLength = Math.max(0, this.treepath.length - baseIndentation);
    // Prepend *non-breakable* spaces to the organization name.
    return ' '.repeat(indentationLength) + this.name;
  }
}
