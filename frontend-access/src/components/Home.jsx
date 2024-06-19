import { useEffect, useState } from 'react';
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
      return (
        <>
          <h2>Posts</h2>
          {posts.map((post) => (
            <Post
              title={post.title}
              timestamp={post.timestamp}
              text={post.text}
              _id={post._id}
              key={post._id}
            />
          ))}
        </>
      );
    }

    return <h2>Loading posts...</h2>;
  }

  return (
    <div>
      <h1>Welcome to my blog!</h1>
      <div>{renderPosts()}</div>
    </div>
  );
}

export default Home;
