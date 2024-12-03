import { theme, plugins } from '@ichiba/ichiba-core-ui';
import withMT from '@material-tailwind/react/utils/withMT';

module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@ichiba/ichiba-core-ui/dist/**/*.{js,jsx,ts,tsx}',
  ],
  theme,
  plugins,
});
