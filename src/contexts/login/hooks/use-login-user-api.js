import React from 'react';
import { LoginApiContext } from '../login-api-context';

export function useLoginUserApi() {
  const context = React.useContext(LoginApiContext);
  return context;
}
