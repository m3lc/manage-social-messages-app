import React from 'react';
import { MentionsApiContext } from '../mentions-api-context';

export function useMentionsApi() {
  const context = React.useContext(MentionsApiContext);
  return context;
}
