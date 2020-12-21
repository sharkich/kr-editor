import * as monaco from 'monaco-editor-core';
import { languageExtensionPoint, languageID } from './config';
import { richLanguageConfiguration, monarchLanguage } from './KRLang';
import { KRLangWorker } from './KRLangWorker';
import { WorkerManager } from './WorkerManager';
import { DiagnosticsAdapter } from './DiagnosticsAdapter';
import { KRLangFormattingProvider } from './KRLangFormattingProvider';

export function setupLanguage() {
  (window as any).MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === languageID) return './KRLangWorker.js';
      return './editor.worker.js';
    },
  };

  monaco.languages.register(languageExtensionPoint);

  monaco.languages.onLanguage(languageID, () => {
    monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);
    monaco.languages.setLanguageConfiguration(languageID, richLanguageConfiguration);
    const client = new WorkerManager();

    const worker: WorkerAccessor = (...uris: monaco.Uri[]): Promise<KRLangWorker> => {
      return client.getLanguageServiceWorker(...uris);
    };
    //Call the errors provider
    new DiagnosticsAdapter(worker);
    monaco.languages.registerDocumentFormattingEditProvider(languageID, new KRLangFormattingProvider(worker));
  });
}

export type WorkerAccessor = (...uris: monaco.Uri[]) => Promise<KRLangWorker>;
