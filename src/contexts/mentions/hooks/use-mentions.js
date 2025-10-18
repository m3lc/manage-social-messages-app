import React from 'react';
import { MentionsContext } from '../mentions-context';

export function useMentions() {
  const context = React.useContext(MentionsContext);
  return context;
}
