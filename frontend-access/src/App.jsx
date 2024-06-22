import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';

function App() {
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => setIsAuth(!!localStorage.getItem('token')), []);

  return (
    <>
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
      <main>
        <Outlet context={[isAuth, setIsAuth]} />
      </main>
    </>
  );
}

export default App;
