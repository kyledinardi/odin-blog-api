import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import Post from './Post.jsx';
import formStyles from '../style/Form.module.css';

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

  async function createPost(e) {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: e.target[0].value,
        isPublished: e.target[1].checked,
        text: e.target[2].value,
      }),
    });

    const responseJson = await response.json();
    setPosts(responseJson.posts);
    e.target.reset();
  }

  function renderPosts() {
    if (posts) {
      return posts.map((post) => (
        <Link key={post._id} to={`posts/${post._id}`}>
          <Post
            title={post.title}
            timestamp={post.timestamp}
            text={post.text}
            isPublished={post.isPublished}
            isHome={true}
          />
        </Link>
      ));
    }

    return <h2>Loading posts...</h2>;
  }

  return (
    <>
      <h2>New Post</h2>
      <form onSubmit={(e) => createPost(e)}>
        <div className={formStyles.fields}>
          <label htmlFor='title'>Title</label>
          <input type='text' name='title' id='title' required />
          <label htmlFor='isPublished'>Published</label>
          <input type='checkbox' name='isPublished' id='isPublished' />
        </div>
        <textarea name='text' id='text' cols='30' rows='10' required></textarea>
        <button type='submit'>Create Post</button>
      </form>
      <h2>Posts</h2>
      {renderPosts()}
    </>
  );
}

export default Home;
