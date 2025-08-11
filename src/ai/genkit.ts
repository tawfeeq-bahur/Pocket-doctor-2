import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { geminiPro } from 'genkit/models';

export const ai = genkit({
  plugins: [googleAI()],
  models: [geminiPro],
});
