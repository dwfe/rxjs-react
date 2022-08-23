import {useEffect, useState} from 'react';
import {handleObsState} from './handleObsState';
import {StateSource} from './contract';

export function useObsState(src: StateSource, initValue?: any) {
  const [state, setState] = useState(initValue);
  useEffect(() => {
    const subscriptions = handleObsState(src, setState);
    return () => {
      subscriptions.forEach(x => x.unsubscribe());
    };
  }, []);
  return state;
}
