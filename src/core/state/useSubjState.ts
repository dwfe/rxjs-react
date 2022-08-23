import {useCallback, useEffect, useState} from 'react';
import {Subj} from '@do-while-for-each/rxjs';
import {useControlledRender} from '../useControlledRender';

export const useSubjState = <T = any>(startValue: T): [Subj<T>, (value: T) => void] => {
  const [subj] = useState<Subj>(new Subj<T>({type: 'shareReplay', bufferSize: 1, startValue}));
  const renderRunFn = useControlledRender();

  const setValue = useCallback( // to prevent pointless re-renders because 'setValue' can be passed as a prop to components
    (value: T) => {
      subj.setValue(value);
      renderRunFn();
    },
    [subj]
  );

  useEffect(
    () => {
      return () => subj.stop();
    },
    [subj]
  );

  return [subj, setValue]
}
