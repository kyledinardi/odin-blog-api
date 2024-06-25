import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Navbar({ isAuth, setIsAuth }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    setIsAuth(false);
    navigate('/login');
  }

  if (isAuth) {
    return (
      <nav>
        <Link to='/'>Home</Link>
        <a href='#' onClick={() => logout()}>
          Log Out
        </a>
      </nav>
    );
  }

  return (
    <nav>
      <Link to='/login'>Log In</Link>
    </nav>
  );
}

Navbar.propTypes = {
  isAuth: PropTypes.bool,
  setIsAuth: PropTypes.func,
};

export default Navbar;
