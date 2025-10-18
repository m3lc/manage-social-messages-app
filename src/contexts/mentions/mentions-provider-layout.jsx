import { MentionsProvider } from './mentions-provider';
import { Outlet } from 'react-router';

export function MentionsProviderLayout() {
  return (
    <MentionsProvider>
      <Outlet />
    </MentionsProvider>
  );
}
