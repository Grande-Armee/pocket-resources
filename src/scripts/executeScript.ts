import '../pathAliases';

import { LoggerService } from '@grande-armee/pocket-common';

import { migrationRevertHandler, migrationRunHandler } from './handlers';
import { setupAppContext } from './setupAppContext';
import { ScriptHandler } from './types';

const scripts = new Map<string, ScriptHandler>()
  .set('migration.run', migrationRunHandler)
  .set('migration.revert', migrationRevertHandler);

export const executeScript = async (scriptName: string): Promise<void> => {
  const scriptHandler = scripts.get(scriptName);

  if (!scriptHandler) {
    throw new Error('Script not found.');
  }

  const appContext = await setupAppContext();

  const logger = appContext.get(LoggerService);

  logger.info('Executing script...', { scriptName });

  await scriptHandler(appContext);

  logger.info('Script successfully executed.', { scriptName });
};

executeScript(process.argv[2])
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
