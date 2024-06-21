import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import Post from './Post.jsx';
import Comment from './Comment.jsx';

function PostPage() {
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [isAuth] = useOutletContext();
  const { postId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/posts/${postId}`, { mode: 'cors' })
      .then((response) => response.json())
      .then((response) => {
        setPost(response.post);
        setComments(response.comments);
      })
      .catch((error) => {
        throw new Error(error);
      });

    fetch('http://localhost:3000/auth/user', {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: localStorage.getItem('token') }),
    })
      .then((response) => response.json())
      .then((response) => {
        setUser(response);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [postId]);

  async function submitComment(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/posts/${postId}/comments`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: e.target[0].value }),
        },
      );

      const responseJson = await response.json();
      setComments(responseJson.comments);
      e.target.reset();
    } catch (err) {
      throw new Error(err);
    }
  }

  function renderPost() {
    if (post) {
      return (
        <>
          <Post
            title={post.title}
            timestamp={post.timestamp}
            text={post.text}
            key={post._id}
          />
        </>
      );
    }

    return <h2>Loading post...</h2>;
  }

  function renderCommentForm() {
    return (
      <form onSubmit={(e) => submitComment(e)}>
        <textarea name='text' id='' cols='30' rows='10' required></textarea>
        <button type='submit'>Post Comment</button>
      </form>
    );
  }

  function renderComments() {
    if (comments) {
      return (
        <>
          <h3>Comments</h3>
          {isAuth ? renderCommentForm() : <h4>Log in to post a comment</h4>}
          <div>
            {comments.map((comment) => (
              <Comment
                user={user}
                commenter={comment.user}
                timestamp={comment.timestamp}
                text={comment.text}
                postId={postId}
                commentId={comment._id}
                key={comment._id}
                setComments={(c) => setComments(c)}
              />
            ))}
          </div>
        </>
      );
    }

    return <h3>Loading comments...</h3>;
  }

  return (
    <div>
      <div>{renderPost()}</div>
      <div>{renderComments()}</div>
    </div>
  );
}

export default PostPage;
