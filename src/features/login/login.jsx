import { useLoginUserApi } from '../../contexts/login/hooks/use-login-user-api';

export function Login() {
  const { onLogin } = useLoginUserApi();

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    await onLogin({ email });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={e => handleSubmit(e)}>
        <input type="text" name="email" placeholder="email" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
