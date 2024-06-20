import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Navbar({ isAuth, setIsAuth }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    setIsAuth(false);
    navigate('/');
  }

  function renderAuth() {
    if (isAuth) {
      return <a href='#' onClick={() => logout()}>Log Out</a>;
    }

    return (
      <>
        <Link to='/login'>Log In</Link>
        <Link to='/sign-up'>Sign Up</Link>
      </>
    );
  }

  return (
    <nav>
      <Link to='/'>Home</Link>
      {renderAuth()}
    </nav>
  );
}

Navbar.propTypes = {
  isAuth: PropTypes.bool,
  setIsAuth: PropTypes.func,
};

export default Navbar;
