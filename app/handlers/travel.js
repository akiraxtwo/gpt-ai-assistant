import { COMMAND_TRAVEL_TRANSLATE } from '../commands/index.js';
import { t } from '../../locales/index.js';
import Context from '../context.js';
import { createChatCompletion } from '../../services/openai.js';
import { updateHistory } from '../history/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.hasCommand(COMMAND_TRAVEL_TRANSLATE);

/**
 * @param {Context} context
 * @returns {Context}
 */
const exec = (context) => check(context) && (
  async () => {
    const question = context.text.replace(COMMAND_TRAVEL_TRANSLATE.alias, '').trim();
    
    if (!question) {
      // If no specific translation request is provided, show common travel phrases
      const commonPhrases = [
        t('__TRAVEL_PHRASE_GREETING'),
        t('__TRAVEL_PHRASE_THANKS'),
        t('__TRAVEL_PHRASE_DIRECTIONS'),
        t('__TRAVEL_PHRASE_RESTAURANT'),
        t('__TRAVEL_PHRASE_EMERGENCY'),
        t('__TRAVEL_PHRASE_ACCOMMODATION')
      ];
      
      context.pushText(t('__COMPLETION_TRAVEL_ASSISTANT'));
      context.pushText(t('__TRAVEL_COMMON_PHRASES'));
      context.pushText(commonPhrases.join('\n'));
      return context;
    }

    try {
      updateHistory(context.id, (history) => {
        history.push({
          role: context.human.role,
          name: context.human.name,
          content: question,
        });
        return history;
      });

      // Enhance the prompt for travel translation context
      const travelPrompt = `${COMMAND_TRAVEL_TRANSLATE.prompt}\n\n${question}\n\nPlease provide the translation in a clear format. If appropriate, also include pronunciation hints and cultural context that might be relevant for a traveler.`;

      const completion = await createChatCompletion({
        messages: [
          {
            role: 'system',
            content: travelPrompt,
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
        
        context.pushText(`${t('__TRAVEL_TRANSLATE_SUCCESS')}\n\n${content}`);
      }
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
