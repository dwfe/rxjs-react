import {Observable} from '@do-while-for-each/rxjs';
import {Dispatch, SetStateAction} from 'react';

export type StateSource = Observable<any> | { [key: string]: Observable<any> };

export type SetState<T = any> = Dispatch<SetStateAction<T>>;
