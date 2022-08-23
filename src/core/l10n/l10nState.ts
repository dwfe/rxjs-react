import React from 'react';
import {langStorage} from './lang.storage';
import {obsState} from '../state';

export function l10nState(component: React.Component){
  obsState(component, {
    lang: langStorage.lang$
  });
}
