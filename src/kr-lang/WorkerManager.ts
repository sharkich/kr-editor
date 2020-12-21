import * as monaco from 'monaco-editor-core';

import Uri = monaco.Uri;
import { KRLangWorker } from './KRLangWorker';
import { languageID } from './config';

export class WorkerManager {
  private worker: monaco.editor.MonacoWebWorker<KRLangWorker>;
  private workerClientProxy: Promise<KRLangWorker>;

  constructor() {
    this.worker = null;
  }

  private getClientProxy(): Promise<KRLangWorker> {
    if (!this.workerClientProxy) {
      this.worker = monaco.editor.createWebWorker<KRLangWorker>({
        // module that exports the create() method and returns a `JSONWorker` instance
        moduleId: 'KRLangWorker',
        label: languageID,
        // passed in to the create() method
        createData: {
          languageId: languageID,
        },
      });

      this.workerClientProxy = <Promise<KRLangWorker>>(<any>this.worker.getProxy());
    }

    return this.workerClientProxy;
  }

  async getLanguageServiceWorker(...resources: Uri[]): Promise<KRLangWorker> {
    const _client: KRLangWorker = await this.getClientProxy();
    await this.worker.withSyncedResources(resources);
    return _client;
  }
}
