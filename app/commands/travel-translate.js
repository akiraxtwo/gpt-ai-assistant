import { TYPE_TRANSLATE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_TRANSLATE,
  label: t('__COMMAND_TRAVEL_TRANSLATE_LABEL'),
  text: t('__COMMAND_TRAVEL_TRANSLATE_TEXT'),
  prompt: t('__COMMAND_TRAVEL_TRANSLATE_PROMPT'),
  aliases: [
    '/旅遊翻譯',
    '/travel-translate',
    '旅遊翻譯',
    '翻譯旅遊',
    'Travel Translate',
  ],
});
