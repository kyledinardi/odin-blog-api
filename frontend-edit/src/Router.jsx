import App from './App.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import PostPage from './components/PostPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'posts/:postId', element: <PostPage /> },
    ],
    errorElement: <ErrorPage />,
  },
];

export default routes;
