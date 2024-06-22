import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Post from './Post.jsx';

function Home() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/posts', { mode: 'cors' })
      .then((response) => response.json())
      .then((response) => setPosts(response))
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

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
      <h1>Welcome to my blog!</h1>
      <div>{renderPosts()}</div>
    </>
  );
}

export default Home;
