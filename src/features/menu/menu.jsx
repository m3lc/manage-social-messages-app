import { Link } from 'react-router';
import { useLoginUserApi } from '../../contexts/login/hooks/use-login-user-api';

export function Menu() {
  const { onLogout } = useLoginUserApi();

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div>
      <ul>
        <Link to="/">Home</Link>
        <br />
        <Link to="/mentions">Mentions</Link>
        <br />
        <a onClick={handleLogout} href="/">
          logout
        </a>
      </ul>
    </div>
  );
}
