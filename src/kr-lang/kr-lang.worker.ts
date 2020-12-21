import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import { KRLangWorker } from './KRLangWorker';

self.onmessage = () => {
  worker.initialize((ctx) => {
    return new KRLangWorker(ctx);
  });
};
