import { COMMAND_TRAVEL_LANGUAGE } from '../commands/index.js';
import { t } from '../../locales/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';

/**
 * List of supported languages with their codes
 */
const SUPPORTED_LANGUAGES = {
  english: 'en',
  spanish: 'es',
  french: 'fr',
  german: 'de',
  italian: 'it',
  portuguese: 'pt',
  japanese: 'ja',
  korean: 'ko',
  chinese: 'zh',
  russian: 'ru',
  arabic: 'ar',
  hindi: 'hi',
  thai: 'th',
  vietnamese: 'vi',
  indonesian: 'id',
  dutch: 'nl',
  greek: 'el',
  turkish: 'tr',
  swedish: 'sv',
  polish: 'pl',
};

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => context.hasCommand(COMMAND_TRAVEL_LANGUAGE);

/**
 * @param {Context} context
 * @returns {Context}
 */
const exec = (context) => check(context) && (
  async () => {
    const input = (context.trimmedText || '').replace(COMMAND_TRAVEL_LANGUAGE.alias, '').trim();
    
    if (!input) {
      // If no language specified, show list of supported languages
      context.pushText(t('__TRAVEL_LANGUAGE_SELECT'));
      
      const languageList = Object.keys(SUPPORTED_LANGUAGES)
        .map(lang => `- ${lang.charAt(0).toUpperCase() + lang.slice(1)}`)
        .join('\n');
      
      context.pushText(languageList);
      return context;
    }

    try {
      const language = input.toLowerCase();
      
      if (!SUPPORTED_LANGUAGES[language]) {
        // Check if it's a language code
        const isValidCode = Object.values(SUPPORTED_LANGUAGES).includes(language);
        if (!isValidCode) {
          context.pushText(t('__TRAVEL_LANGUAGE_INVALID'));
          return context;
        }
      }
      
      // Set the language preference in context
      context.setPreference('targetLanguage', language);
      
      updateHistory(context.id, (history) => {
        history.push({
          role: context.human.role,
          name: context.human.name,
          content: input,
        });
        return history;
      });
      
      const successMessage = t('__TRAVEL_LANGUAGE_SUCCESS').replace('{{language}}', 
        language.charAt(0).toUpperCase() + language.slice(1));
      
      context.pushText(successMessage);
      
      updateHistory(context.id, (history) => {
        history.push({
          role: context.ai.role,
          name: context.ai.name,
          content: successMessage,
        });
        return history;
      });
      
    } catch (err) {
      context.pushError(err);
    }
    
    return context;
  }
)();

export default exec;
