import PropTypes from 'prop-types';

function Post({ title, timestamp, text }) {
  const date = new Date(timestamp);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

  return (
    <div>
      <h2>
        {title}
        <span> {formattedDate}</span>
      </h2>
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
