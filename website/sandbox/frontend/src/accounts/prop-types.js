import PropTypes from 'prop-types';


function user() {
  return PropTypes.shape({
    username: PropTypes.string.isRequired,
    display_name: PropTypes.string.isRequired,
    avatar_url: PropTypes.string.isRequired,
  });
}

function currentUser() {
  return PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    display_name: PropTypes.string.isRequired,
    avatar_url: PropTypes.string.isRequired,
    is_staff: PropTypes.bool.isRequired,
  });
}


export default {
  user,
  currentUser,
};
