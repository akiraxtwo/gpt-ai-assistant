import { TYPE_TRANSLATE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_TRANSLATE,
  label: t('__TRAVEL_LANGUAGE'),
  text: t('__TRAVEL_LANGUAGE'),
  prompt: t('__TRAVEL_LANGUAGE_PROMPT'),
  aliases: [
    '/旅遊語言',
    '/travel-language',
    '旅遊語言',
    '設置語言',
    '選擇語言',
    'Travel Language',
  ],
});
