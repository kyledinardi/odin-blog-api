import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    const data = {
      email: e.target[0].value,
      password: e.target[1].value,
      passwordConfirmation: e.target[2].value,
    };

    try {
      const response = await fetch('http://localhost:3000/auth/sign-up', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();
      e.target.reset();

      if (responseJson.errors.length > 0) {
        setErrors(responseJson.errors);
      } else {
        navigate('/login');
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  function renderErrors() {
    if (errors) {
      return (
        <div>
          {errors.map((error) => (
            <p key={error.msg}>{error.msg}</p>
          ))}
        </div>
      );
    }

    return null;
  }

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={(e) => submit(e)}>
        <label htmlFor='email'>Email </label>
        <input type='email' name='email' id='email' required />
        <label htmlFor='password'>Password </label>
        <input type='password' name='password' id='password' required />
        <label htmlFor='passwordConfirmation'>Confirm Password </label>
        <input
          type='password'
          name='passwordConfirmation'
          id='passwordConfirmation'
          required
        />
        <button type='submit'>Sign Up</button>
      </form>
      <>{renderErrors()}</>
    </>
  );
}

export default SignUp;
