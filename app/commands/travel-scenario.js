import { TYPE_TRANSLATE } from '../../constants/command.js';
import { t } from '../../locales/index.js';
import Command from './command.js';

export default new Command({
  type: TYPE_TRANSLATE,
  label: t('__TRAVEL_SCENARIO'),
  text: t('__TRAVEL_SCENARIO'),
  prompt: t('__TRAVEL_SCENARIO_PROMPT'),
  aliases: [
    '/旅遊情境',
    '/travel-scenario',
    '旅遊情境',
    '旅遊場景',
    '旅遊狀況',
    'Travel Scenario',
  ],
});
