import {Observable, Subscription} from '@do-while-for-each/rxjs';
import {isJustObject} from '@do-while-for-each/common';
import {SetState, StateSource} from './contract';

export function handleObsState(src: StateSource, setState: SetState): Subscription[] {
  const subscriptions = [];
  if (src instanceof Observable) {
    subscriptions.push(
      src.subscribe(setState)
    );
  } else if (isJustObject(src)) {
    for (const [fieldName, src$] of Object.entries(src)) {
      subscriptions.push(
        src$.subscribe(nextValue => {
          setState((state: any) => ({
            ...state,
            [fieldName]: nextValue
          }));
        })
      );
    }
  }
  return subscriptions;
}
