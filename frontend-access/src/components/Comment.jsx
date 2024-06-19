import PropTypes from 'prop-types';

function Comment({ user, timestamp, text }) {
  const date = new Date(timestamp);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

  return (
    <div>
      <p>
        {user}
        <span> {formattedDate}</span>
      </p>
      <p>{text}</p>
    </div>
  );
}

Comment.propTypes = {
  user: PropTypes.string,
  timestamp: PropTypes.string,
  text: PropTypes.string,
};
export default Comment;
