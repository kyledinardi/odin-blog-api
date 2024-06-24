import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import Post from './Post.jsx';

function Home() {
  const [posts, setPosts] = useState(null);
  const [isAuth] = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    } else {
      fetch('http://localhost:3000/posts', { mode: 'cors' })
        .then((response) => response.json())
        .then((response) => setPosts(response))
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [isAuth, navigate]);

  function renderPosts() {
    if (posts) {
      return posts.map((post) => (
        <Link key={post._id} to={`posts/${post._id}`}>
          <Post
            title={post.title}
            timestamp={post.timestamp}
            text={post.text}
          />
        </Link>
      ));
    }

    return <h2>Loading posts...</h2>;
  }

  return (
    <>
      <h1>Posts</h1>
      {renderPosts()}
    </>
  );
}

export default Home;
