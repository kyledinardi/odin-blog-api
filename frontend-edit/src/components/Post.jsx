import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from '../style/Post.module.css';

function Post({
  title,
  timestamp,
  text,
  isPublished,
  postId,
  setPost,
  isHome,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const date = new Date(timestamp);
  const navigate = useNavigate();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

  async function updatePost(e) {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'PUT',
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
      setIsEdit(false);
      setPost(responseJson.post);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function deletePost() {
    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      await response.json();
      navigate('/');
    } catch (err) {
      throw new Error(err);
    }
  }

  if (isEdit) {
    return (
      <form onSubmit={(e) => updatePost(e)}>
        <label htmlFor='title'>Title</label>
        <input
          type='text'
          name='title'
          id='title'
          required
          defaultValue={title}
        />
        <label htmlFor='isPublished'>Published</label>
        <input
          type='checkbox'
          name='isPublished'
          id='isPublished'
          defaultChecked={isPublished}
        />
        <textarea
          name='text'
          id='text'
          cols='30'
          rows='10'
          required
          defaultValue={text}
        ></textarea>
        <button type='button' onClick={() => setIsEdit(!isEdit)}>
          Cancel
        </button>
        <button type='submit'>Update</button>
      </form>
    );
  }

  return (
    <div className={styles.post}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.timestamp}> {formattedDate}</p>
      <p>{isPublished ? 'Published' : 'Not Published'}</p>
      <p>{text}</p>
      {!isHome && (
        <div>
          <button onClick={() => setIsEdit(true)}>Edit</button>
          <button onClick={() => setIsDeleting(true)}>Delete</button>
        </div>
      )}
      {isDeleting && (
        <div>
          <h3>Are you sure you want to delete this post?</h3>
          <button onClick={() => deletePost()}>Yes</button>
          <button onClick={() => setIsDeleting(false)}>No</button>
        </div>
      )}
    </div>
  );
}

Post.propTypes = {
  title: PropTypes.string,
  timestamp: PropTypes.string,
  text: PropTypes.string,
  isPublished: PropTypes.bool,
  postId: PropTypes.string,
  setPost: PropTypes.func,
  isHome: PropTypes.bool,
};

export default Post;
