import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../style/Post.module.css';

function Post({ title, timestamp, text, isPublished, postId, setPost }) {
  const [isEdit, setIsEdit] = useState(false);
  const date = new Date(timestamp);

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
      setIsEdit(!isEdit);
      setPost(responseJson.post);
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
      <p className={styles.timestamp}> ({formattedDate})</p>
      <p>{isPublished ? 'Published' : 'Not Published'}</p>
      <p>{text}</p>
      <button onClick={() => setIsEdit(!isEdit)}>Edit</button>
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
};

export default Post;
