import * as monaco from 'monaco-editor-core';

import IWorkerContext = monaco.worker.IWorkerContext;
import { KRLangLanguageService } from './language-service/LanguageService';
import { IKRLangError } from './language-service/KRLangErrorListener';

export class KRLangWorker {
  private _ctx: IWorkerContext;
  private languageService: KRLangLanguageService;
  constructor(ctx: IWorkerContext) {
    this._ctx = ctx;
    this.languageService = new KRLangLanguageService();
  }

  doValidation(): Promise<IKRLangError[]> {
    const code = this.getTextDocument();
    return Promise.resolve(this.languageService.validate(code));
  }
  format(code: string): Promise<string> {
    return Promise.resolve(this.languageService.format(code));
  }
  private getTextDocument(): string {
    const model = this._ctx.getMirrorModels()[0]; // When there are multiple files open, this will be an array
    return model.getValue();
  }
}
