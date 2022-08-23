import {langStorage} from './lang.storage';
import {useObsState} from '../state';

export function useL10nState() {
  return useObsState(langStorage.lang$, langStorage.lang);
}
