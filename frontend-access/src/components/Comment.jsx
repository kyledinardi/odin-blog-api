import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../style/Comment.module.css';

function Comment({
  user,
  commenter,
  timestamp,
  text,
  postId,
  commentId,
  setComments,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const date = new Date(timestamp);

  function decodeHTMLEntities(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  const decodedText = decodeHTMLEntities(text);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

  async function updateComment(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/posts/${postId}/comments/${commentId}`,
        {
          method: 'PUT',
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: e.target[0].value }),
        },
      );

      const responseJson = await response.json();
      const { comments } = responseJson;
      setComments(comments);
      setIsEdit(!isEdit);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function deleteComment() {
    try {
      const response = await fetch(
        `http://localhost:3000/posts/${postId}/comments/${commentId}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const comments = await response.json();
      setComments(comments);
    } catch (err) {
      throw new Error(err);
    }
  }

  function renderButtons() {
    if (commenter.email === user.email || user.isAdmin) {
      return (
        <div>
          {commenter.email === user.email && (
            <button onClick={() => setIsEdit(!isEdit)}>
              {isEdit ? 'Cancel' : 'Edit'}
            </button>
          )}
          <button onClick={() => deleteComment()}>Delete</button>
        </div>
      );
    }

    return null;
  }

  return (
    <div className={styles.comment}>
      <h4 className={styles.email}>{commenter.email}</h4>
      <p className={styles.timestamp}> {formattedDate}</p>
      {isEdit ? (
        <div>
          <form onSubmit={(e) => updateComment(e)}>
            <textarea
              name=''
              id=''
              cols='30'
              rows='10'
              required
              defaultValue={decodedText}
            ></textarea>
            <button type='submit'>Update Comment</button>
          </form>
        </div>
      ) : (
        <p>{decodedText}</p>
      )}
      {renderButtons()}
    </div>
  );
}

Comment.propTypes = {
  user: PropTypes.object,
  commenter: PropTypes.object,
  timestamp: PropTypes.string,
  text: PropTypes.string,
  postId: PropTypes.string,
  commentId: PropTypes.string,
  setComments: PropTypes.func,
};

export default Comment;
