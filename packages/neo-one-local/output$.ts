import { Subject } from 'rxjs';

interface ConsoleMessage {
  readonly message: string;
}

// tslint:disable-next-line export-name
export const output$ = new Subject<ConsoleMessage>();
