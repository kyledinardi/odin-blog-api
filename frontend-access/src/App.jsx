import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';

function App() {
  const [isAuth, setIsAuth] = useState(null);

  return (
    <>
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
      <Outlet context={setIsAuth} />
    </>
  );
}

export default App;
