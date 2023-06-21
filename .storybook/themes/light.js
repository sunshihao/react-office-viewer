import { create } from '@storybook/theming';
import pkg from '../../package.json';

export default create({
  base: 'light',
  brandTitle: `xhx前端组件库v.${pkg.version}`,
});