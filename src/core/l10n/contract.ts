import {TAnyObject} from '@do-while-for-each/common';

export const ALL_LANG = ['ru', 'en'] as const;
type LangTuple = typeof ALL_LANG;
export type TLang = LangTuple[number];

export type EqualsDictionary<T1, T2> = T1 extends T2 ? T2 extends T1 ? T1 | T2 : never : never;
export type Translator<TRu, TEn> =
  { (path: string, params?: TAnyObject): string }
  & EqualsDictionary<TEn, TRu>
// & { shared: Equals<typeof shared['en'], typeof shared['ru']> }
  ;
