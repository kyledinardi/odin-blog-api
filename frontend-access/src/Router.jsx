import App from './App.jsx';
import Home from './components/Home.jsx';
import PostPage from './components/PostPage.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import ErrorPage from './components/ErrorPage.jsx';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,

    children: [
      { index: true, element: <Home /> },
      { path: 'posts/:postId', element: <PostPage /> },
      { path: 'login', element: <Login /> },
      { path: 'sign-up', element: <SignUp /> },
    ],

  },
];

export default routes;
