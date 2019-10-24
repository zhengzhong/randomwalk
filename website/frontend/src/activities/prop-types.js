import PropTypes from 'prop-types';

import AccountsPropTypes from '../accounts/prop-types';


function group() {
  return PropTypes.shape({
    pk: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  });
}

function activity({ persisted }) {
  const shape = {
    pk: PropTypes.number,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    thumbnail: PropTypes.string, // nullable
    scheduled_date: PropTypes.string.isRequired,
    closing_date: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    // Some fields are editable in HTML form. When populated from user input and before validation,
    // they may take string values.
    max_headcount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // nullable
    base_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    custom_subscription_fields: PropTypes.array.isRequired,
    subscription_notice: PropTypes.string.isRequired,
    accept_online_payment: PropTypes.bool.isRequired,
    is_published: PropTypes.bool.isRequired,
  };
  if (persisted) {
    Object.assign(shape, {
      pk: PropTypes.number.isRequired,
      group: group().isRequired,
      headcount: PropTypes.number.isRequired,
      creator: AccountsPropTypes.user().isRequired,
      create_date: PropTypes.string.isRequired,
      update_date: PropTypes.string.isRequired,
      tag_list: PropTypes.arrayOf(PropTypes.string).isRequired,
    });
  }
  return PropTypes.shape(shape);
}

function subscriber({ persisted }) {
  const shape = {
    pk: PropTypes.number,
    real_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    custom_fields: PropTypes.arrayOf(PropTypes.shape({
      uniqueId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  };
  if (persisted) {
    Object.assign(shape, {
      pk: PropTypes.number.isRequired,
      activity_pk: PropTypes.number.isRequired,
      user: AccountsPropTypes.user().isRequired,
      is_phone_number_verified: PropTypes.bool.isRequired,
      calculated_price: PropTypes.number.isRequired,
      payment_key: PropTypes.string.isRequired,
      is_paid: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
      subscribe_date: PropTypes.string.isRequired,
    });
  }
  return PropTypes.shape(shape);
}

export default {
  activity,
  subscriber,
};
