import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Post({ title, timestamp, text, _id }) {
  const date = new Date(timestamp);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

  return (
    <div>
      <Link to={`posts/${_id}`}>
        <h3>{title} </h3>
        <span>{formattedDate}</span>
      </Link>
      <p>{text}</p>
    </div>
  );
}

Post.propTypes = {
  title: PropTypes.string,
  timestamp: PropTypes.string,
  text: PropTypes.string,
  _id: PropTypes.string,
};

export default Post;
