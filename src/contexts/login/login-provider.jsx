import { useLayoutEffect, useMemo, useReducer } from 'react';
import { LoginApiContext } from './login-api-context';
import { LoginContext } from './login-context';
import { http } from '../../services/http';
import { usersApi } from '../../services/api';

const initialState = {
  user: null,
};

export function LoginProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initHttp = data => {
    if (data) {
      http.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    } else {
      http.defaults.headers.common['Authorization'] = '';
    }
  };

  const api = useMemo(
    () => ({
      onInit: async () => {
        const data = localStorage.getItem('msm-data');
        if (data) {
          dispatch({
            type: 'init',
            data: JSON.parse(data),
          });

          initHttp(JSON.parse(data));
        }
      },
      onLogin: async user => {
        try {
          const data = await usersApi.login(user);
          localStorage.setItem('msm-data', JSON.stringify(data));

          initHttp(data);

          dispatch({
            type: 'login',
            data: data,
          });
        } catch (err) {
          console.error('Login failed:', err);
          throw err;
        }
      },
      onLogout: async () => {
        localStorage.removeItem('msm-data');
        initHttp(null);
        dispatch({
          type: 'logout',
        });
      },
    }),
    [dispatch]
  );

  useLayoutEffect(() => {
    api.onInit();
  }, [api]);

  return (
    <LoginApiContext value={api}>
      <LoginContext value={state}>{children}</LoginContext>
    </LoginApiContext>
  );
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'init':
      return { ...state, user: action.data.user };
    case 'login':
      return { ...state, user: action.data.user };
    case 'logout':
      return { ...state, user: null };
    default:
      return state;
  }
};
