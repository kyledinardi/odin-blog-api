import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from './Post.jsx';
import Comment from './Comment.jsx';

function PostPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
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
  }, [postId]);

  function renderPost() {
    if (post) {
      return (
        <>
          <Post
            title={post.title}
            timestamp={post.timestamp}
            text={post.text}
            _id={post._id}
            key={post._id}
          />
        </>
      );
    }

    return <h2>Loading post...</h2>;
  }

  function renderComments() {
    if (comments) {
      return (
        <>
          <h3>Comments</h3>
          <div>
            {comments.map((comment) => (
              <Comment
                user={comment.user.email}
                timestamp={comment.timestamp}
                text={comment.text}
                key={comment._id}
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
