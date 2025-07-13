import { TYPE_TRANSLATE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_TRANSLATE,
  label: t('__TRAVEL_COMMON_PHRASES'),
  text: t('__TRAVEL_COMMON_PHRASES'),
  prompt: t('__TRAVEL_PHRASES_PROMPT'),
  aliases: [
    '/旅遊短語',
    '/travel-phrases',
    '旅遊短語',
    '常用短語',
    '旅遊語句',
    'Travel Phrases',
  ],
});
