import { COMMAND_TRAVEL_SCENARIO } from '../commands/index.js';
import { t } from '../../locales/index.js';
import Context from '../context.js';
import { createChatCompletion } from '../../services/openai.js';
import { updateHistory } from '../history/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.hasCommand(COMMAND_TRAVEL_SCENARIO);

/**
 * @param {Context} context
 * @returns {Context}
 */
const exec = (context) => check(context) && (
  async () => {
    const input = context.text.replace(COMMAND_TRAVEL_SCENARIO.alias, '').trim();
    
    if (!input) {
      // If no specific scenario is provided, show common travel scenarios
      const commonScenarios = [
        t('__TRAVEL_SCENARIO_RESTAURANT'),
        t('__TRAVEL_SCENARIO_HOTEL'),
        t('__TRAVEL_SCENARIO_TRANSIT'),
        t('__TRAVEL_SCENARIO_EMERGENCY'),
        t('__TRAVEL_SCENARIO_SHOPPING'),
        t('__TRAVEL_SCENARIO_SIGHTSEEING')
      ];
      
      context.pushText(t('__COMPLETION_TRAVEL_ASSISTANT'));
      context.pushText(t('__TRAVEL_COMMON_SCENARIOS'));
      context.pushText(commonScenarios.join('\n'));
      return context;
    }

    try {
      // Parse input format: scenario|language
      // Example: "restaurant|spanish" or "ordering food|japanese"
      const parts = input.split('|');
      const scenario = parts[0].trim();
      const language = parts.length > 1 ? parts[1].trim() : '';

      updateHistory(context.id, (history) => {
        history.push({
          role: context.human.role,
          name: context.human.name,
          content: input,
        });
        return history;
      });

      const prompt = language 
        ? `${t('__TRAVEL_SCENARIO_PROMPT')}\n\nScenario: ${scenario}\nLanguage: ${language}`
        : `${t('__TRAVEL_SCENARIO_PROMPT')}\n\nScenario: ${scenario}`;

      const completion = await createChatCompletion({
        messages: [
          {
            role: 'system',
            content: prompt,
          },
        ],
      });

      if (completion?.data?.choices?.[0]?.message?.content) {
        const { content } = completion.data.choices[0].message;
        
        updateHistory(context.id, (history) => {
          history.push({
            role: context.ai.role,
            name: context.ai.name,
            content,
          });
          return history;
        });
        
        context.pushText(`${t('__TRAVEL_SCENARIO_RESULT')}\n\n${content}`);
      }
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
