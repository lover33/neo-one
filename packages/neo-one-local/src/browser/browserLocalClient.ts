import { DeveloperClient, NEOONEDataProvider } from '@neo-one/client';
import { JSONRPCLocalProvider } from '@neo-one/node-browser';
import { Subject } from 'rxjs';
import { constants } from '../constants';
import { build, BuildResult } from './build';
import { ConsoleMessage, EditorFiles } from './types';

class BrowserLocalClient {
  private mutableOutput$: Subject<ConsoleMessage> = new Subject();
  private mutableFiles: EditorFiles = [];

  public async getNEOTrackerURL(): Promise<string | undefined> {
    return undefined;
  }

  public async reset(): Promise<void> {
    const developerClient = new DeveloperClient(
      new NEOONEDataProvider({ network: constants.LOCAL_NETWORK_NAME, rpcURL: new JSONRPCLocalProvider() }),
    );
    await developerClient.reset();
    await developerClient.updateSettings({ secondsPerBlock: 15 });

    await this.build();
  }

  public async build(): Promise<BuildResult> {
    return build({ output$: this.mutableOutput$, files: this.mutableFiles });
  }

  public setOutput$(output$: Subject<ConsoleMessage>): void {
    this.mutableOutput$ = output$;
  }

  public setFiles(files: EditorFiles): void {
    this.mutableFiles = files;
  }
}

export const browserLocalClient = new BrowserLocalClient();
