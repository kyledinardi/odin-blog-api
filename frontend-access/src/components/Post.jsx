import PropTypes from 'prop-types';
import styles from '../style/Post.module.css';

function Post({ title, timestamp, text }) {
  return (
    <div className={styles.post}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.timestamp}>
        ({new Date(timestamp).toLocaleString()})
      </p>
      <p>{text}</p>
    </div>
  );
}

Post.propTypes = {
  title: PropTypes.string,
  timestamp: PropTypes.string,
  text: PropTypes.string,
};

export default Post;
