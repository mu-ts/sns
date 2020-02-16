import { MessageAttribute } from './MessageAttribute';

export interface Listener {
  arnPrefix?: string;
  arnPostfix?: string;
  attributes?: MessageAttribute[];
  behavior: Function;
}
