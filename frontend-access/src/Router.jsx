import App from './App.jsx';
import Home from './components/Home.jsx';
import PostPage from './components/PostPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';

const routes = [
  {
    path: '/',
    Element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'posts/:postId', element: <PostPage /> },
    ],
    errorElement: <ErrorPage />,
  },
];

export default routes;
