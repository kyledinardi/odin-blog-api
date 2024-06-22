import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../style/Form.module.css'

function Login() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [, setIsAuth] = useOutletContext();

  async function submit(e) {
    e.preventDefault();

    const data = {
      email: e.target[0].value,
      password: e.target[1].value,
    };

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();
      localStorage.setItem('token', responseJson.token);
      e.target.reset();

      if (responseJson.error) {
        setError(responseJson.error);
      } else {
        setIsAuth(true);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  }

  function renderErrors() {
    if (error) {
      return (
        <div>
          <p key={error.message}>{error.message}</p>
        </div>
      );
    }

    return null;
  }

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={(e) => submit(e)}>
        <div className={styles.fields}>
          <label htmlFor='email'>Email</label>
          <input type='email' name='email' id='email' />
          <label htmlFor='password'>Password</label>
          <input type='password' name='password' id='password' />
        </div>
        <button type='submit'>Log in</button>
      </form>
      <>{renderErrors()}</>
    </>
  );
}

export default Login;
