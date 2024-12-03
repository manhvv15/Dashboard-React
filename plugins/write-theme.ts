import { theme } from '@ichiba/ichiba-core-ui';
import fs from 'fs-extra';
import { PluginOption } from 'vite';

export function writeTheme(): PluginOption {
  return {
    name: 'write-theme',
    apply: 'serve',
    async configResolved(this) {
      await fs.writeFile('theme.config.json', JSON.stringify(theme, null, 4));
    },
  };
}
