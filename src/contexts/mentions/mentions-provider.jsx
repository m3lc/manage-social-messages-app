import { useEffect, useMemo, useReducer } from 'react';
import { MentionsApiContext } from './mentions-api-context';
import { MentionsContext } from './mentions-context';
import { http } from '../../services/http';
import { sleep } from '../../services/utils/sleep';

const POLL_INTERVAL = 5000;

const initialState = {
  mentions: [],
  loading: false,
  error: null,
};

export function MentionsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = useMemo(() => {
    return {
      fetchMentions: async signal => {
        dispatch({ type: 'fetch_start' });
        try {
          const res = await http(
            `${import.meta.env.VITE_API_BASE_URL}/mentions`,
            {
              method: 'GET',
              signal,
            }
          );
          dispatch({ type: 'fetch_success', data: res.data });

          // Poll if syncing is in progress
          if (res.data?.meta?.isSyncing) {
            await sleep(POLL_INTERVAL);
            return await api.fetchMentions(signal);
          }

          return res.data;
        } catch (err) {
          dispatch({ type: 'fetch_error', error: err.message });
          throw err;
        }
      },
      updateMention: async (id, mentionData) => {
        try {
          const res = await http(
            `${import.meta.env.VITE_API_BASE_URL}/mentions/${id}`,
            {
              method: 'PUT',
              data: mentionData,
            }
          );
          dispatch({ type: 'update_mention', data: res.data });
          return res.data;
        } catch (err) {
          console.error('Error updating mention:', err);
          throw err;
        }
      },
      fetchUsers: async signal => {
        try {
          const res = await http(`${import.meta.env.VITE_API_BASE_URL}/users`, {
            method: 'GET',
            signal,
          });
          return res.data.result || res.data || [];
        } catch (err) {
          console.error('Failed to fetch users:', err);
          throw err;
        }
      },
      sendReply: async (id, replyData) => {
        try {
          const res = await http(
            `${import.meta.env.VITE_API_BASE_URL}/mentions/${id}/reply`,
            {
              method: 'POST',
              data: replyData,
            }
          );
          return res.data;
        } catch (err) {
          console.error('Error sending reply:', err);
          throw err;
        }
      },
    };
  }, [dispatch]);

  useEffect(() => {
    const abortController = new AbortController();
    api.fetchMentions(abortController.signal);
    return () => abortController.abort();
  }, [api]);

  return (
    <MentionsApiContext value={api}>
      <MentionsContext value={state}>{children}</MentionsContext>
    </MentionsApiContext>
  );
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'fetch_start':
      return { ...state, loading: true, error: null };
    case 'fetch_success':
      return {
        ...state,
        loading: false,
        mentions: action.data.result,
        error: null,
      };
    case 'fetch_error':
      return { ...state, loading: false, error: action.error };
    case 'update_mention':
      return {
        ...state,
        mentions: state.mentions.map(mention =>
          mention.id === action.data.id ? action.data : mention
        ),
      };
    default:
      return state;
  }
};
