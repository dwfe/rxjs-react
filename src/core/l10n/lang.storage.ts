import {Observable, Subj} from '@do-while-for-each/rxjs';
import {TAnyObject} from '@do-while-for-each/common';
import {ALL_LANG, TLang, Translator} from './contract';

const STORAGE_KEY = 'lang';

class LangStorage {

  private _lang = new Subj<TLang>({type: 'shareReplay', bufferSize: 1});
  private updatersOfActiveDictionaries: ((lang: TLang) => void)[] = [];

  constructor() {
    const storageLang = window.localStorage.getItem(STORAGE_KEY) as any;
    this.lang = ALL_LANG.includes(storageLang) ? storageLang : 'en';
  }

  get lang$(): Observable<TLang> {
    return this._lang.value$;
  }

  get lang(): TLang {
    return this._lang.lastValue;
  }

  set lang(lang: TLang) {
    if (this.lang === lang)
      return;
    window.localStorage.setItem(STORAGE_KEY, lang);
    this.updatersOfActiveDictionaries.forEach(x => x(lang));
    this._lang.setValue(lang);
  }

  addDictionary<TEn, TRu>(dictionaries: { en: TEn, ru: TRu }): Translator<TRu, TEn> {
    const compositePathTranslator = (path: string, params?: TAnyObject): string => {
      const dictionary = dictionaries[this.lang] ?? {};
      const result = path.split('.').reduce((result: TAnyObject | string, item: string) => {
        if (typeof result === 'string')
          throw new Error(`Missing element "${item}" because result "${result}" is already string: lang "${this.lang}" path "${path}" `);
        return result[item];
      }, dictionary) as TAnyObject | string;
      if (typeof result !== 'string')
        throw new Error(`The translation search result is an object: lang "${this.lang}" path "${path}" result "${JSON.stringify(result)}"`);
      if (params) // if need to fill template params e.g. for result: "{{hour}} h {{minute}} m"
        return result.replace(/{{([\w\d.]+)}}/g, (_: string, match: string) => params[match]);
      return result;
    };
    const result = Object.assign(
      compositePathTranslator,
      dictionaries[this.lang] ?? {},
      // {shared: shared[this.lang]},
    ) as Translator<TRu, TEn>;
    this.updatersOfActiveDictionaries.push(
      lang => {
        Object.assign(
          result,
          dictionaries[lang] ?? {},
          // {shared: shared[lang]},
        );
      }
    );
    return result;
  }

}

export const langStorage = new LangStorage();

