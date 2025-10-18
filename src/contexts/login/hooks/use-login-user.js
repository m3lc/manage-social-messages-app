import React from 'react';
import { LoginContext } from '../login-context';

export function useLoginUser() {
  const context = React.useContext(LoginContext);
  return context;
}
