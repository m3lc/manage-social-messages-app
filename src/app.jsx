import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Menu } from './features/menu/menu';
import { Main } from './features/main/main';
import { Mentions } from './features/mentions/mentions';
import { MentionDetails } from './features/mentions/mentions-detail';
import { LoginProvider } from './contexts/login/login-provider';
import { useLoginUser } from './contexts/login/hooks/use-login-user';
import { Login } from './features/login/login';
import { MentionsProviderLayout } from './contexts/mentions/mentions-provider-layout';

export function App() {
  const { user } = useLoginUser();

  return (
    <>
      <div className="app">
        {user ? (
          <LoginProvider>
            <h4>
              Logged in as {' >> '}
              <span style={{ color: 'lightgreen' }}>{user.email}</span>
            </h4>
            <BrowserRouter>
              <div className="menu">
                <Menu />
              </div>
              <div className="main">
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route element={<MentionsProviderLayout />}>
                    <Route path="/mentions" element={<Mentions />} />
                    <Route path="/mentions/:id" element={<MentionDetails />} />
                  </Route>
                </Routes>
              </div>
            </BrowserRouter>
          </LoginProvider>
        ) : (
          <Login />
        )}
      </div>
    </>
  );
}
