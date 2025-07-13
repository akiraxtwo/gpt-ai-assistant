import { COMMAND_TRAVEL_PHRASES } from '../commands/index.js';
import { t } from '../../locales/index.js';
import Context from '../context.js';
import { createChatCompletion } from '../../services/openai.js';
import { updateHistory } from '../history/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.hasCommand(COMMAND_TRAVEL_PHRASES);

/**
 * @param {Context} context
 * @returns {Context}
 */
const exec = (context) => check(context) && (
  async () => {
    const language = context.text.replace(COMMAND_TRAVEL_PHRASES.alias, '').trim();
    
    try {
      const targetLanguage = language || t('__TRAVEL_TARGET_LANGUAGE');
      
      updateHistory(context.id, (history) => {
        history.push({
          role: context.human.role,
          name: context.human.name,
          content: targetLanguage,
        });
        return history;
      });

      // Common travel phrases with their descriptions
      const commonPhrases = [
        t('__TRAVEL_PHRASE_GREETING'),
        t('__TRAVEL_PHRASE_THANKS'),
        t('__TRAVEL_PHRASE_DIRECTIONS'),
        t('__TRAVEL_PHRASE_RESTAURANT'),
        t('__TRAVEL_PHRASE_EMERGENCY'),
        t('__TRAVEL_PHRASE_ACCOMMODATION')
      ];
      
      const phrasesPrompt = `${t('__TRAVEL_PHRASES_PROMPT')}\n\n${commonPhrases.join(', ')}\n\nPlease translate these common travel phrases to ${targetLanguage}. For each phrase, provide the translation and pronunciation guide where helpful.`;

      const completion = await createChatCompletion({
        messages: [
          {
            role: 'system',
            content: phrasesPrompt,
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
        
        context.pushText(`${t('__TRAVEL_COMMON_PHRASES')} - ${targetLanguage}\n\n${content}`);
      }
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
